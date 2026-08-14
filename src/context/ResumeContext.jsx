import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { defaultResumeData, emptyResumeSchema } from '../data/sampleResume';
import { calculateResumeHealth } from '../utils/resumeHealth';
import { calculateATSScore } from '../utils/atsEngine';
import { validateResumeContent } from '../utils/validationEngine';
import { analyzeKeywords } from '../utils/keywordEngine';
import { simulateRecruiterGlance } from '../utils/recruiterSimulation';
import { trackEvent, AnalyticsEvents } from '../utils/analytics';
import { stripInternalMetadata } from '../utils/metadata';
import { mapFirebaseUserToSession, cacheSession, logoutUser, hasUserClaimedWelcomeCredits, markWelcomeCreditsClaimed } from '../services/ecosystem/authManager';
import { useAuth } from './AuthContext';
import { DEFAULT_PROFILE_PHOTO, isPhotoTemplate } from '../utils/photoDefaults';
import { getTemplateCapabilities } from '../utils/templateCapabilities';

import { apiService } from '../services/api';

const ResumeContext = createContext(null);

const STORAGE_COLLECTION_KEY = 'opportunityx_resumes_collection_v2';
const ACTIVE_ID_KEY = 'opportunityx_active_resume_id_v2';
const RECOVERY_DRAFT_KEY = 'opportunityx_resume_recovery_draft_v1';
const USER_PREFS_KEY = 'opportunityx_user_preferences_v1';
const VERSIONS_KEY = 'opportunityx_resume_versions_v2';
const SCAN_HISTORY_KEY = 'opportunityx_scan_history_v1';
const AI_CREDITS_KEY = 'opportunityx_ai_credits_v1';
const BYOK_KEY = 'opportunityx_byok_keys_v1';
const SELECTED_MODEL_KEY = 'opportunityx_selected_ai_model_v1';

// Helper function to sanitize raw or malformed date strings
export const cleanDateString = (str) => {
  if (!str || typeof str !== 'string') return '';
  const trimmed = str.trim();
  if (!trimmed) return '';

  // If it's a huge string of repeated numbers like "44524242424242424", extract year/month or clean it
  if (/^\d{8,}$/.test(trimmed)) {
    const yearMatch = trimmed.match(/(19|20)\d{2}/);
    if (yearMatch) return yearMatch[0];
    return '';
  }

  // If it matches standard Present/Current keywords
  if (/^(present|current|till date|now|today|ongoing)$/i.test(trimmed)) {
    return 'Present';
  }

  return trimmed;
};

// One-time hydration function run on import / load to parse initial fields and remove stale fallbacks
export const hydrateAndNormalizeResume = (resume) => {
  if (!resume || typeof resume !== 'object') return resume;

  const fixArray = (arr, prefix) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((item, idx) => {
      if (typeof item === 'string') {
        return { id: `${prefix}-${idx}-${Date.now()}`, name: item, title: item };
      }
      if (typeof item === 'object' && item !== null) {
        const itemCopy = { ...item };
        if (!itemCopy.id) {
          itemCopy.id = `${prefix}-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
        }

        // Normalize Experience items
        if (prefix === 'exp') {
          itemCopy.role = itemCopy.role || itemCopy.title || itemCopy.jobTitle || '';
          itemCopy.title = itemCopy.role;
          itemCopy.company = itemCopy.company || itemCopy.organization || itemCopy.employer || '';
          itemCopy.location = itemCopy.location || '';

          const periodRaw = itemCopy.period || '';
          delete itemCopy.period; // Delete stale period property so runtime editing never re-parses it!

          let sDate = cleanDateString(itemCopy.startDate || itemCopy.start_date || '');
          let eDate = cleanDateString(itemCopy.endDate || itemCopy.end_date || '');
          delete itemCopy.start_date;
          delete itemCopy.end_date;

          const isCurrentMentioned =
            itemCopy.current === true ||
            itemCopy.isCurrent === true ||
            /present|current|till date|now|ongoing/i.test(periodRaw) ||
            /present|current|till date|now|ongoing/i.test(eDate);

          if (periodRaw && (!sDate || (!eDate && !isCurrentMentioned))) {
            const parts = periodRaw.split(/\s*[-–—]| to \s*/i);
            if (parts.length >= 2) {
              if (!sDate) sDate = cleanDateString(parts[0]);
              if (!eDate) eDate = cleanDateString(parts.slice(1).join(' - '));
            } else if (!sDate) {
              sDate = cleanDateString(periodRaw);
            }
          }

          const finalIsCurrent = isCurrentMentioned || eDate === 'Present' || /present|current/i.test(eDate);
          itemCopy.startDate = sDate;
          itemCopy.endDate = finalIsCurrent ? '' : (eDate === 'Present' ? '' : eDate);
          itemCopy.current = finalIsCurrent;
          itemCopy.isCurrent = finalIsCurrent;

          // Bullets normalization
          if (!Array.isArray(itemCopy.bullets)) {
            if (typeof itemCopy.description === 'string' && itemCopy.description.trim()) {
              itemCopy.bullets = itemCopy.description
                .split(/\n|•|;/)
                .map((b) => b.trim().replace(/^[-•*]\s*/, ''))
                .filter(Boolean);
            } else if (typeof itemCopy.highlights === 'string' && itemCopy.highlights.trim()) {
              itemCopy.bullets = itemCopy.highlights.split(/\n|•/).map((b) => b.trim()).filter(Boolean);
            } else {
              itemCopy.bullets = [];
            }
          } else {
            itemCopy.bullets = itemCopy.bullets.map((b) => (typeof b === 'string' ? b : String(b || ''))).filter(Boolean);
          }
        }

        // Normalize Education items
        if (prefix === 'edu') {
          itemCopy.degree = itemCopy.degree || itemCopy.title || itemCopy.major || '';
          itemCopy.institution = itemCopy.institution || itemCopy.college || itemCopy.school || itemCopy.university || '';
          itemCopy.college = itemCopy.institution;
          itemCopy.gpa = itemCopy.gpa || itemCopy.cgpa || itemCopy.grade || '';

          const periodRaw = itemCopy.period || '';
          delete itemCopy.period;

          let sDate = cleanDateString(itemCopy.startDate || itemCopy.start_date || '');
          let eDate = cleanDateString(itemCopy.endDate || itemCopy.end_date || '');
          delete itemCopy.start_date;
          delete itemCopy.end_date;

          if (periodRaw && (!sDate || !eDate)) {
            const parts = periodRaw.split(/\s*[-–—]| to \s*/i);
            if (parts.length >= 2) {
              if (!sDate) sDate = cleanDateString(parts[0]);
              if (!eDate) eDate = cleanDateString(parts.slice(1).join(' - '));
            } else if (!sDate) {
              sDate = cleanDateString(periodRaw);
            }
          }

          itemCopy.startDate = sDate;
          itemCopy.endDate = eDate;
        }

        // Normalize Projects items
        if (prefix === 'proj') {
          itemCopy.title = itemCopy.title || itemCopy.name || '';
          itemCopy.name = itemCopy.title;
          itemCopy.link = itemCopy.link || itemCopy.url || itemCopy.htmlUrl || '';

          if (Array.isArray(itemCopy.technologies)) {
            itemCopy.techStack = itemCopy.technologies.join(', ');
          } else if (typeof itemCopy.techStack === 'string') {
            itemCopy.technologies = itemCopy.techStack.split(',').map((s) => s.trim()).filter(Boolean);
          } else {
            itemCopy.technologies = [];
            itemCopy.techStack = '';
          }
        }

        return itemCopy;
      }
      return item;
    });
  };

  // Personal Info Hydration
  const personalRaw = resume.personal || {};
  const personalSync = {
    ...personalRaw,
    fullName: personalRaw.fullName || personalRaw.name || '',
    jobTitle: personalRaw.jobTitle || personalRaw.targetRole || personalRaw.role || '',
    email: personalRaw.email || '',
    phone: personalRaw.phone || '',
    location: personalRaw.location || '',
    linkedin: personalRaw.linkedin || '',
    github: personalRaw.github || '',
    website: personalRaw.website || personalRaw.portfolio || '',
    summary: personalRaw.summary || ''
  };

  // Skills Hydration
  let skillsSync = { languages: [], frameworks: [], tools: [] };
  const rawSkills = resume.skills;
  if (rawSkills) {
    if (Array.isArray(rawSkills)) {
      rawSkills.forEach((s) => {
        if (typeof s === 'string') {
          skillsSync.tools.push(s);
        } else if (typeof s === 'object' && s !== null) {
          const items = Array.isArray(s.items) ? s.items : (Array.isArray(s.skills) ? s.skills : []);
          const catLower = (s.category || s.name || '').toLowerCase();
          if (catLower.includes('lang')) {
            skillsSync.languages.push(...items.map(String));
          } else if (catLower.includes('frame') || catLower.includes('lib') || catLower.includes('tech')) {
            skillsSync.frameworks.push(...items.map(String));
          } else {
            skillsSync.tools.push(...items.map(String));
          }
        }
      });
    } else if (typeof rawSkills === 'object') {
      skillsSync = {
        languages: Array.isArray(rawSkills.languages) ? rawSkills.languages.map(String) : [],
        frameworks: Array.isArray(rawSkills.frameworks) ? rawSkills.frameworks.map(String) : [],
        tools: Array.isArray(rawSkills.tools) ? rawSkills.tools.map(String) : []
      };
      Object.keys(rawSkills).forEach((key) => {
        if (!['languages', 'frameworks', 'tools'].includes(key) && Array.isArray(rawSkills[key])) {
          skillsSync[key] = rawSkills[key].map(String);
        }
      });
    }
  }

  return {
    ...resume,
    personal: personalSync,
    skills: skillsSync,
    education: fixArray(resume.education, 'edu'),
    experience: fixArray(resume.experience, 'exp'),
    projects: fixArray(resume.projects, 'proj'),
    certificates: fixArray(resume.certificates, 'cert'),
    achievements: fixArray(resume.achievements, 'ach'),
    languages: fixArray(resume.languages, 'lang'),
    customSections: fixArray(resume.customSections, 'cust')
  };
};

// Pure runtime pass-through for useMemo: ONLY guarantees IDs & array shapes without overwriting user edits/empty strings
export const ensureResumeItemIds = (resume) => {
  if (!resume || typeof resume !== 'object') return resume;

  const fixArray = (arr, prefix) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((item, idx) => {
      if (typeof item === 'string') {
        return { id: `${prefix}-${idx}-${Date.now()}`, name: item, title: item };
      }
      if (typeof item === 'object' && item !== null) {
        let itemCopy = { ...item };
        if (!itemCopy.id) {
          itemCopy.id = `${prefix}-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
        }
        if (prefix === 'exp' && !Array.isArray(itemCopy.bullets)) {
          itemCopy.bullets = [];
        }
        return itemCopy;
      }
      return item;
    });
  };

  return {
    ...resume,
    personal: resume.personal || {},
    skills: resume.skills || { languages: [], frameworks: [], tools: [] },
    education: fixArray(resume.education, 'edu'),
    experience: fixArray(resume.experience, 'exp'),
    projects: fixArray(resume.projects, 'proj'),
    certificates: fixArray(resume.certificates, 'cert'),
    achievements: fixArray(resume.achievements, 'ach'),
    languages: fixArray(resume.languages, 'lang'),
    customSections: fixArray(resume.customSections, 'cust')
  };
};

export const ResumeProvider = ({ children }) => {
  // 0. Firebase Auth Integration
  const { user: firebaseUser, isAuthenticated: fbIsAuth, logout: fbLogout } = useAuth();

  // Derive session from Firebase auth state (backward-compatible shape)
  const [session, setSession] = useState(() => mapFirebaseUserToSession(null));

  // Non-expiring AI Credits State (0 for guests; loaded per UID on login)
  const [aiCredits, setAiCredits] = useState({
    remaining: 0,
    totalPurchased: 0,
    usageHistory: []
  });

  // Sync session & AI credits whenever Firebase auth state changes
  useEffect(() => {
    const newSession = mapFirebaseUserToSession(firebaseUser);
    setSession(newSession);
    cacheSession(newSession);

    if (firebaseUser) {
      const userCreditsKey = `${AI_CREDITS_KEY}_${firebaseUser.uid}`;

      // Trigger background sync with production FastAPI backend
      apiService.syncAuth().then(async () => {
        try {
          const walletData = await apiService.getCreditBalance();
          if (walletData && typeof walletData.remaining_credits === 'number') {
            setAiCredits({
              remaining: walletData.remaining_credits,
              totalPurchased: walletData.total_purchased || 0,
              usageHistory: []
            });
            return;
          }
        } catch (e) {}
      }).catch((err) => {
        console.warn("Backend auth sync offline or unavailable, falling back to local cache:", err.message);
      });

      try {
        const saved = localStorage.getItem(userCreditsKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.remaining === 'number') {
            setAiCredits({
              remaining: parsed.remaining,
              totalPurchased: parsed.totalPurchased || 0,
              usageHistory: Array.isArray(parsed.usageHistory) ? parsed.usageHistory : []
            });
            return;
          }
        }
      } catch (e) {}

      // First time login for this Firebase UID: Grant 5 Welcome AI Credits
      const welcomeCredits = {
        remaining: 5,
        totalPurchased: 0,
        usageHistory: [
          {
            id: `welcome-${Date.now()}`,
            action: '5 Welcome AI Credits Granted',
            timestamp: new Date().toISOString(),
            creditsUsed: 0
          }
        ]
      };
      markWelcomeCreditsClaimed(firebaseUser.uid);
      setAiCredits(welcomeCredits);
      try {
        localStorage.setItem(userCreditsKey, JSON.stringify(welcomeCredits));
      } catch (e) {}
    } else {
      // Guest Mode: 0 AI credits until logged in
      setAiCredits({
        remaining: 0,
        totalPurchased: 0,
        usageHistory: []
      });
    }
  }, [firebaseUser]);

  // Persist AI credits per-UID whenever aiCredits state changes for a logged in user
  useEffect(() => {
    if (firebaseUser?.uid) {
      const userCreditsKey = `${AI_CREDITS_KEY}_${firebaseUser.uid}`;
      try {
        localStorage.setItem(userCreditsKey, JSON.stringify(aiCredits));
      } catch (e) {}
    }
  }, [aiCredits, firebaseUser]);

  // 1. Resumes Collection State
  const [resumes, setResumes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COLLECTION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((r) => hydrateAndNormalizeResume(r));
        }
      }
    } catch (e) {}
    return [
      hydrateAndNormalizeResume({
        ...emptyResumeSchema,
        metadata: { ...emptyResumeSchema.metadata, id: 'ox-resume-initial', uuid: 'ox-resume-initial', title: 'My Resume' }
      })
    ];
  });

  // 2. Active Resume ID State
  const [activeResumeId, setActiveResumeIdState] = useState(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_ID_KEY);
      if (savedId && resumes.some((r) => r.metadata?.id === savedId || r.metadata?.uuid === savedId)) {
        return savedId;
      }
    } catch (e) {}
    return resumes[0]?.metadata?.id || 'ox-resume-initial';
  });



  // Derived Active Resume Object
  const activeResume = useMemo(() => {
    const raw = resumes.find((r) => r.metadata?.id === activeResumeId || r.metadata?.uuid === activeResumeId) || resumes[0] || defaultResumeData;
    return ensureResumeItemIds(raw);
  }, [resumes, activeResumeId]);

  // Dynamic Intelligence Computations
  const resumeHealth = useMemo(() => calculateResumeHealth(activeResume), [activeResume]);
  const atsEngineResult = useMemo(() => calculateATSScore(activeResume), [activeResume]);
  const validationResult = useMemo(() => validateResumeContent(activeResume), [activeResume]);
  const keywordResult = useMemo(() => analyzeKeywords(activeResume), [activeResume]);
  const recruiterScanResult = useMemo(() => simulateRecruiterGlance(activeResume, atsEngineResult.overallScore, resumeHealth.percentage), [activeResume, atsEngineResult, resumeHealth]);

  // Overall Resume Strength (Weighted Blend)
  const resumeStrengthScore = useMemo(() => {
    const atsWeight = (atsEngineResult.overallScore || 0) * 0.4;
    const healthWeight = (resumeHealth.percentage || 0) * 0.3;
    const flawDeduction = (validationResult.criticalCount || 0) * 10;
    const score = Math.max(0, Math.min(100, Math.round(atsWeight + healthWeight + 30 - flawDeduction)));
    return score;
  }, [atsEngineResult, resumeHealth, validationResult]);

  const strengthLabel = useMemo(() => {
    if (resumeStrengthScore >= 85) return 'Excellent';
    if (resumeStrengthScore >= 70) return 'Good';
    if (resumeStrengthScore >= 50) return 'Needs Improvement';
    return 'Weak';
  }, [resumeStrengthScore]);

  // 3. Scan History State
  const [scanHistory, setScanHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(SCAN_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: `scan-1`,
        timestamp: new Date().toISOString(),
        resumeTitle: defaultResumeData.metadata.title,
        overallScore: 92,
        atsScore: 94,
        healthScore: 90,
        version: 1
      }
    ];
  });

  useEffect(() => {
    try { localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(scanHistory)); } catch (e) {}
  }, [scanHistory]);

  const runResumeScan = useCallback(() => {
    const scanEntry = {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toISOString(),
      resumeTitle: activeResume.metadata?.title || 'Untitled Resume',
      overallScore: resumeStrengthScore,
      atsScore: atsEngineResult.overallScore,
      healthScore: resumeHealth.percentage,
      version: activeResume.metadata?.version || 1
    };
    setScanHistory((prev) => [scanEntry, ...prev]);
    return scanEntry;
  }, [activeResume, resumeStrengthScore, atsEngineResult, resumeHealth]);

  // 4. Session Recovery Draft
  const [hasRecoveryDraft, setHasRecoveryDraft] = useState(false);
  const [recoveryDraft, setRecoveryDraft] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECOVERY_DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.metadata && parsed.metadata.id === activeResumeId) {
          setRecoveryDraft(parsed);
          setHasRecoveryDraft(true);
        }
      }
    } catch (e) {}
  }, [activeResumeId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try { localStorage.setItem(RECOVERY_DRAFT_KEY, JSON.stringify(activeResume)); } catch (e) {}
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeResume]);

  const restoreRecoveryDraft = useCallback(() => {
    if (recoveryDraft) {
      setResumes((prev) => prev.map((r) => (r.metadata?.id === activeResumeId ? recoveryDraft : r)));
      localStorage.removeItem(RECOVERY_DRAFT_KEY);
      setHasRecoveryDraft(false);
      setRecoveryDraft(null);
    }
  }, [recoveryDraft, activeResumeId]);

  const discardRecoveryDraft = useCallback(() => {
    localStorage.removeItem(RECOVERY_DRAFT_KEY);
    setHasRecoveryDraft(false);
    setRecoveryDraft(null);
  }, []);

  // 5. User Preferences
  const [userPreferences, setUserPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_PREFS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { zoom: 85, paperBackground: 'white', defaultTemplate: 'modern', exportPreset: 'Corporate' };
  });

  useEffect(() => {
    try { localStorage.setItem(USER_PREFS_KEY, JSON.stringify(userPreferences)); } catch (e) {}
  }, [userPreferences]);

  const updateUserPreferences = useCallback((updater) => {
    setUserPreferences((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  }, []);

  // Selected AI Model Persistence
  const [selectedAIModel, setSelectedAIModel] = useState(() => {
    try {
      const saved = localStorage.getItem(SELECTED_MODEL_KEY);
      if (saved) return saved;
    } catch (e) {}
    return 'openrouter/auto';
  });

  useEffect(() => {
    try { localStorage.setItem(SELECTED_MODEL_KEY, selectedAIModel); } catch (e) {}
  }, [selectedAIModel]);

  // Save Status
  const [saveStatus, setSaveStatus] = useState('Saved to LocalStorage');
  const [lastSavedTimeStr, setLastSavedTimeStr] = useState('Just now');

  // Undo / Redo Stacks
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // Version Snapshots
  const [versionMap, setVersionMap] = useState(() => {
    try {
      const saved = localStorage.getItem(VERSIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      [defaultResumeData.metadata.id]: [
        { id: `v1-${Date.now()}`, versionNumber: 1, title: 'Initial Draft', timestamp: new Date().toISOString(), data: defaultResumeData }
      ]
    };
  });


  // BYOK Keys loaded securely from environment (.env) or localStorage
  const ENV_OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_KEY || '';
  const [byokKeys, setByokKeys] = useState(() => {
    try {
      const saved = localStorage.getItem(BYOK_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...parsed, openrouter: parsed.openrouter || ENV_OPENROUTER_KEY };
      }
    } catch (e) {}
    return { openai: '', gemini: '', openrouter: ENV_OPENROUTER_KEY, anthropic: '' };
  });

  // Modals visibility states
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false);
  const [isBYOKModalOpen, setIsBYOKModalOpen] = useState(false);
  const [isAIUpgradePromptOpen, setIsAIUpgradePromptOpen] = useState(false);
  const [isUnlockAIModalOpen, setIsUnlockAIModalOpen] = useState(false);
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const [isAICreditsModalOpen, setIsAICreditsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false);
  const [isExportCenterOpen, setIsExportCenterOpen] = useState(false);
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  const [isProfilePresetsOpen, setIsProfilePresetsOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isScanHistoryOpen, setIsScanHistoryOpen] = useState(false);
  const [isCompanyMatchOpen, setIsCompanyMatchOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isGitHubImportModalOpen, setIsGitHubImportModalOpen] = useState(false);
  const [isOpportunityXImportModalOpen, setIsOpportunityXImportModalOpen] = useState(false);


  // Auto-Save Effect
  useEffect(() => {
    setSaveStatus('Saving...');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_COLLECTION_KEY, JSON.stringify(resumes));
        localStorage.setItem(ACTIVE_ID_KEY, activeResumeId);
        setSaveStatus('Saved to LocalStorage');
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSavedTimeStr(nowStr);
      } catch (e) {
        setSaveStatus('Storage limit reached');
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [resumes, activeResumeId]);

  useEffect(() => { try { localStorage.setItem(VERSIONS_KEY, JSON.stringify(versionMap)); } catch (e) {} }, [versionMap]);
  useEffect(() => { try { localStorage.setItem(AI_CREDITS_KEY, JSON.stringify(aiCredits)); } catch (e) {} }, [aiCredits]);
  useEffect(() => { try { localStorage.setItem(BYOK_KEY, JSON.stringify(byokKeys)); } catch (e) {} }, [byokKeys]);

  // Mutators & Operations
  const updateActiveResume = useCallback((updater) => {
    setResumes((prevResumes) => {
      return prevResumes.map((r) => {
        if (r.metadata?.id === activeResumeId || r.metadata?.uuid === activeResumeId) {
          const nextData = typeof updater === 'function' ? updater(r) : updater;
          setPast((p) => [...p.slice(-29), r]);
          setFuture([]);
          return { ...nextData, metadata: { ...nextData.metadata, lastSaved: new Date().toISOString(), updatedAt: new Date().toISOString() } };
        }
        return r;
      });
    });
  }, [activeResumeId]);

  const setActiveResumeId = useCallback((id) => {
    if (resumes.some((r) => r.metadata?.id === id || r.metadata?.uuid === id)) {
      setActiveResumeIdState(id);
      setPast([]);
      setFuture([]);
    }
  }, [resumes]);

  const createNewResume = useCallback((template = 'modern', customTitle = '') => {
    const newId = `ox-resume-${Date.now()}`;
    const title = customTitle || `New ${template.charAt(0).toUpperCase() + template.slice(1)} Resume`;
    const newResume = {
      ...emptyResumeSchema,
      metadata: { ...emptyResumeSchema.metadata, id: newId, uuid: newId, title, template, lastSaved: new Date().toISOString() }
    };
    setResumes((prev) => [newResume, ...prev]);
    setActiveResumeIdState(newId);
    setPast([]);
    setFuture([]);
    trackEvent(AnalyticsEvents.RESUME_CREATED, { id: newId, template });
    return newId;
  }, []);

  const importResumeData = useCallback((importedSchema) => {
    if (!importedSchema || !importedSchema.metadata) return;
    const normalizedSchema = hydrateAndNormalizeResume(importedSchema);
    const newId = normalizedSchema.metadata.id || `ox-resume-import-${Date.now()}`;
    const formatted = {
      ...normalizedSchema,
      metadata: { ...normalizedSchema.metadata, id: newId, uuid: newId, lastSaved: new Date().toISOString() }
    };
    setResumes((prev) => [formatted, ...prev]);
    setActiveResumeIdState(newId);
    setPast([]);
    setFuture([]);
    return newId;
  }, []);

  const duplicateResume = useCallback((idToDuplicate) => {
    const target = resumes.find((r) => r.metadata?.id === idToDuplicate) || activeResume;
    const newId = `ox-resume-${Date.now()}`;
    const duplicated = JSON.parse(JSON.stringify(target));
    duplicated.metadata.id = newId;
    duplicated.metadata.uuid = newId;
    duplicated.metadata.title = `${target.metadata.title} (Copy)`;
    duplicated.metadata.lastSaved = new Date().toISOString();

    setResumes((prev) => [duplicated, ...prev]);
    setActiveResumeIdState(newId);
    setPast([]);
    setFuture([]);
    trackEvent(AnalyticsEvents.RESUME_DUPLICATED, { originalId: idToDuplicate, newId });
    return newId;
  }, [resumes, activeResume]);

  const deleteResume = useCallback((idToDelete) => {
    if (resumes.length <= 1) {
      const newId = `ox-resume-${Date.now()}`;
      const blank = { ...emptyResumeSchema, metadata: { ...emptyResumeSchema.metadata, id: newId, uuid: newId, title: "My Resume" } };
      setResumes([blank]);
      setActiveResumeIdState(newId);
    } else {
      const filtered = resumes.filter((r) => r.metadata.id !== idToDelete && r.metadata.uuid !== idToDelete);
      setResumes(filtered);
      if (activeResumeId === idToDelete) {
        setActiveResumeIdState(filtered[0].metadata.id);
      }
    }
    setPast([]);
    setFuture([]);
    trackEvent(AnalyticsEvents.RESUME_DELETED, { id: idToDelete });
  }, [resumes, activeResumeId]);

  const renameResume = useCallback((idToRename, newTitle) => {
    if (!newTitle || !newTitle.trim()) return;
    setResumes((prev) =>
      prev.map((r) => (r.metadata.id === idToRename || r.metadata.uuid === idToRename ? { ...r, metadata: { ...r.metadata, title: newTitle.trim() } } : r))
    );
  }, []);

  const toggleFavorite = useCallback((idToToggle) => {
    setResumes((prev) => prev.map((r) => (r.metadata.id === idToToggle || r.metadata.uuid === idToToggle ? { ...r, metadata: { ...r.metadata, isFavorite: !r.metadata?.isFavorite } } : r)));
  }, []);

  const toggleArchive = useCallback((idToToggle) => {
    setResumes((prev) => prev.map((r) => (r.metadata.id === idToToggle || r.metadata.uuid === idToToggle ? { ...r, metadata: { ...r.metadata, isArchived: !r.metadata?.isArchived } } : r)));
  }, []);

  const toggleSectionVisibility = useCallback((sectionId) => {
    updateActiveResume((prev) => {
      const currentHidden = prev.metadata?.hiddenSections || [];
      const isCurrentlyHidden = currentHidden.includes(sectionId);
      const nextHidden = isCurrentlyHidden ? currentHidden.filter((s) => s !== sectionId) : [...currentHidden, sectionId];
      return { ...prev, metadata: { ...prev.metadata, hiddenSections: nextHidden } };
    });
  }, [updateActiveResume]);

  const updateAssets = useCallback((assetType, base64Url) => {
    updateActiveResume((prev) => ({ ...prev, assets: { ...(prev.assets || {}), [assetType]: base64Url } }));
  }, [updateActiveResume]);

  const updateStyle = useCallback((field, value) => {
    updateActiveResume((prev) => ({ ...prev, style: { ...(prev.style || {}), [field]: value } }));
  }, [updateActiveResume]);

  const applyResumePreset = useCallback((presetName) => {
    updateActiveResume((prev) => {
      let targetTemplate = prev.metadata?.template || 'modern';
      let targetProfile = prev.metadata?.targetProfile || 'Software Developer';
      let accentColor = prev.metadata?.accentColor || '#F97316';

      if (presetName === 'Fresher' || presetName === 'Student') {
        targetTemplate = 'compact-entry';
        targetProfile = presetName === 'Fresher' ? 'Fresher & Entry Level' : 'Student & Campus Placement';
        accentColor = '#F97316';
      } else if (presetName === 'Experienced') {
        targetTemplate = 'executive';
        targetProfile = 'Experienced Professional';
        accentColor = '#1E293B';
      } else if (presetName === 'International' || presetName === 'International Resume') {
        targetTemplate = 'minimal';
        targetProfile = 'International Applicant';
        accentColor = '#2563EB';
      }

      const caps = getTemplateCapabilities(targetTemplate);
      const isPhoto = caps.supportsPhoto;
      const defaultVisiblePos = caps.supportedPhotoPositions?.find(p => p !== 'hidden') || 'top-right';

      let nextPhotoPosition = prev.assets?.photoPosition;
      if (isPhoto) {
        if (!nextPhotoPosition || nextPhotoPosition === 'hidden') {
          nextPhotoPosition = defaultVisiblePos;
        }
      }

      return {
        ...prev,
        assets: {
          ...(prev.assets || {}),
          photoPosition: nextPhotoPosition
        },
        metadata: {
          ...prev.metadata,
          template: targetTemplate,
          targetProfile,
          accentColor,
          lastSaved: new Date().toISOString()
        }
      };
    });
  }, [updateActiveResume]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast(past.slice(0, past.length - 1));
    setFuture((f) => [activeResume, ...f]);
    setResumes((prev) => prev.map((r) => (r.metadata.id === activeResumeId ? previous : r)));
  }, [past, activeResume, activeResumeId]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setPast((p) => [...p, activeResume]);
    setFuture(future.slice(1));
    setResumes((prev) => prev.map((r) => (r.metadata.id === activeResumeId ? next : r)));
  }, [future, activeResume, activeResumeId]);

  const loadDemoResume = useCallback(() => {
    const newId = `ox-resume-demo-${Date.now()}`;
    const demo = {
      ...defaultResumeData,
      metadata: { ...defaultResumeData.metadata, id: newId, uuid: newId, title: "Alex Rivera - Full Stack Engineer Resume", lastSaved: new Date().toISOString() }
    };
    setResumes((prev) => [demo, ...prev]);
    setActiveResumeIdState(newId);
    setPast([]);
    setFuture([]);
  }, []);

  const activeVersions = versionMap[activeResumeId] || [];

  const createVersionSnapshot = useCallback((customTitle = '') => {
    const nextVersionNum = activeVersions.length + 1;
    const newVersion = {
      id: `v${nextVersionNum}-${Date.now()}`,
      versionNumber: nextVersionNum,
      title: customTitle || `Version ${nextVersionNum} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      timestamp: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(activeResume))
    };
    setVersionMap((prev) => ({ ...prev, [activeResumeId]: [newVersion, ...(prev[activeResumeId] || [])] }));
  }, [activeVersions, activeResume, activeResumeId]);

  const restoreVersionSnapshot = useCallback((versionId) => {
    const target = activeVersions.find((v) => v.id === versionId);
    if (target) updateActiveResume(target.data);
  }, [activeVersions, updateActiveResume]);

  // Auth Operations — delegated to Firebase via AuthContext
  // handleLogin now opens the AuthModal (actual auth happens via Firebase popup/email)
  const handleLogin = useCallback(() => {
    setIsAuthOpen(true);
  }, []);

  const handleLogout = useCallback(async () => {
    await fbLogout();
    const guestSession = await logoutUser();
    setSession(guestSession);
  }, [fbLogout]);

  // Credit Management Operations
  const addPurchasedCredits = useCallback((creditsAmount, packDetails = 'Credit Pack') => {
    const added = Number(creditsAmount) || 0;
    if (added <= 0) return;

    setAiCredits((prev) => ({
      remaining: (prev.remaining || 0) + added,
      totalPurchased: (prev.totalPurchased || 0) + added,
      usageHistory: [
        {
          id: `buy-${Date.now()}`,
          action: `Purchased ${added} Credits (${packDetails})`,
          timestamp: new Date().toISOString(),
          creditsUsed: 0
        },
        ...prev.usageHistory
      ]
    }));
  }, []);

  // Gate check before running any AI feature
  const checkAIAccess = useCallback((featureName = 'AI Feature') => {
    if (!session || !session.isAuthenticated || session.isGuest) {
      setIsUnlockAIModalOpen(true);
      return false;
    }

    if (aiCredits.remaining <= 0) {
      setIsBuyCreditsModalOpen(true);
      return false;
    }

    return true;
  }, [session, aiCredits.remaining]);

  const consumeCredit = useCallback((actionName = 'AI Feature') => {
    if (aiCredits.remaining <= 0) {
      setIsBuyCreditsModalOpen(true);
      return false;
    }
    setAiCredits((prev) => ({
      ...prev,
      remaining: Math.max(0, prev.remaining - 1),
      usageHistory: [
        { id: `use-${Date.now()}`, action: actionName, timestamp: new Date().toISOString(), creditsUsed: 1 },
        ...prev.usageHistory
      ]
    }));
    return true;
  }, [aiCredits.remaining]);

  const saveByokKeys = useCallback((newKeys) => setByokKeys(newKeys), []);

  const exportActiveResumeJSON = useCallback((clean = true) => {
    const dataToExport = clean ? stripInternalMetadata(activeResume) : activeResume;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activeResume.metadata.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_opportunityx.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [activeResume]);

  const importResumeJSON = useCallback((jsonContent) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || typeof parsed !== 'object') throw new Error("Invalid JSON structure");
      const newId = `ox-resume-import-${Date.now()}`;
      const imported = {
        ...emptyResumeSchema,
        ...parsed,
        metadata: { ...emptyResumeSchema.metadata, ...(parsed.metadata || {}), id: newId, uuid: newId, title: parsed.metadata?.title ? `${parsed.metadata.title} (Imported)` : "Imported Resume", lastSaved: new Date().toISOString() }
      };
      setResumes((prev) => [imported, ...prev]);
      setActiveResumeIdState(newId);
      return true;
    } catch (err) {
      alert("Failed to import JSON file.");
      return false;
    }
  }, []);

  const importGitHubData = useCallback((payload) => {
    if (!payload) return;
    const { personal, projects = [], skills = [], updateSummary = false } = payload;

    updateActiveResume((prev) => {
      const existingPersonal = prev.personal || {};
      const updatedPersonal = {
        ...existingPersonal,
        fullName: personal?.fullName || existingPersonal.fullName || '',
        location: personal?.location || existingPersonal.location || '',
        website: personal?.website || existingPersonal.website || '',
        github: personal?.github || existingPersonal.github || '',
        summary: (updateSummary && personal?.summary) ? personal.summary : (existingPersonal.summary || '')
      };

      // Projects merging
      const existingProjects = Array.isArray(prev.projects) ? [...prev.projects] : [];
      const newProjects = [...existingProjects];

      projects.forEach(p => {
        const pTitle = (p.title || p.name || '').toLowerCase().trim();
        const pUrl = (p.htmlUrl || p.link || '').toLowerCase().trim();

        const matchIndex = newProjects.findIndex(ex => {
          const exTitle = (ex.title || ex.name || '').toLowerCase().trim();
          const exLink = (ex.link || ex.url || '').toLowerCase().trim();
          return (exTitle && exTitle === pTitle) || (exLink && pUrl && exLink === pUrl);
        });

        const projectItem = {
          id: p.id || `proj-gh-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          title: p.title || p.name,
          description: Array.isArray(p.bullets) && p.bullets.length > 0 ? p.bullets.join('\n') : (p.description || ''),
          technologies: Array.isArray(p.technologies) ? p.technologies : [p.language].filter(Boolean),
          link: p.htmlUrl || p.link || ''
        };

        if (matchIndex !== -1) {
          if (p.action === 'replace') {
            newProjects[matchIndex] = projectItem;
          } else if (p.action === 'merge') {
            const ex = newProjects[matchIndex];
            newProjects[matchIndex] = {
              ...ex,
              description: ex.description ? `${ex.description}\n${projectItem.description}` : projectItem.description,
              technologies: [...new Set([...(ex.technologies || []), ...(projectItem.technologies || [])])],
              link: ex.link || projectItem.link
            };
          }
          // If action === 'skip', keep existing without changes
        } else {
          newProjects.push(projectItem);
        }
      });

      // Skills merging
      const existingSkills = prev.skills || {};
      let updatedSkills = { ...existingSkills };

      if (Array.isArray(skills) && skills.length > 0) {
        if (Array.isArray(existingSkills.languages) || Array.isArray(existingSkills.frameworks) || Array.isArray(existingSkills.tools)) {
          updatedSkills = {
            languages: [...new Set([...(existingSkills.languages || []), ...skills.filter(s => s.type === 'language').map(s => s.name || s)])],
            frameworks: [...new Set([...(existingSkills.frameworks || []), ...skills.filter(s => s.type === 'framework').map(s => s.name || s)])],
            tools: [...new Set([...(existingSkills.tools || []), ...skills.filter(s => s.type === 'tool').map(s => s.name || s)])]
          };
        } else if (Array.isArray(existingSkills)) {
          const ghCategoryName = 'GitHub & Technical Skills';
          const ghItems = skills.map(s => typeof s === 'string' ? s : (s.name || s));
          const catIndex = existingSkills.findIndex(c => (c.category || '').toLowerCase() === ghCategoryName.toLowerCase());

          if (catIndex !== -1) {
            const cat = existingSkills[catIndex];
            const mergedItems = [...new Set([...(cat.items || []), ...ghItems])];
            const nextArr = [...existingSkills];
            nextArr[catIndex] = { ...cat, items: mergedItems };
            updatedSkills = nextArr;
          } else {
            updatedSkills = [
              ...existingSkills,
              { id: `cat-gh-${Date.now()}`, category: ghCategoryName, items: ghItems }
            ];
          }
        } else {
          updatedSkills = {
            languages: skills.filter(s => s.type === 'language' || !s.type).map(s => s.name || s),
            frameworks: skills.filter(s => s.type === 'framework').map(s => s.name || s),
            tools: skills.filter(s => s.type === 'tool').map(s => s.name || s)
          };
        }
      }

      return {
        ...prev,
        personal: updatedPersonal,
        projects: newProjects,
        skills: updatedSkills,
        metadata: {
          ...prev.metadata,
          lastSaved: new Date().toISOString()
        }
      };
    });

    setIsGitHubImportModalOpen(false);
  }, [updateActiveResume]);

  const importOpportunityXData = useCallback((payload) => {
    if (!payload) return;
    const {
      personal,
      education = [],
      experience = [],
      projects = [],
      skills = [],
      certificates = [],
      achievements = [],
      openSource = []
    } = payload;

    updateActiveResume((prev) => {
      const existingPersonal = prev.personal || {};
      const updatedPersonal = {
        ...existingPersonal,
        fullName: personal?.fullName || existingPersonal.fullName || '',
        email: personal?.email || existingPersonal.email || '',
        phone: personal?.phone || existingPersonal.phone || '',
        location: personal?.location || existingPersonal.location || '',
        website: personal?.website || existingPersonal.website || '',
        linkedin: personal?.linkedin || existingPersonal.linkedin || '',
        github: personal?.github || existingPersonal.github || '',
        summary: personal?.summary || existingPersonal.summary || ''
      };

      // Profile photo asset update
      const updatedAssets = {
        ...(prev.assets || {}),
        profilePhoto: personal?.photoUrl || prev.assets?.profilePhoto || null
      };

      // Education merging
      const existingEducation = Array.isArray(prev.education) ? [...prev.education] : [];
      const newEducation = [...existingEducation];

      education.forEach(edu => {
        const eduDeg = (edu.degree || '').toLowerCase().trim();
        const matchIndex = newEducation.findIndex(ex => (ex.degree || '').toLowerCase().trim() === eduDeg);
        const eduItem = {
          id: edu.id || `edu-ox-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          degree: edu.degree || '',
          institution: edu.institution || edu.college || '',
          location: edu.location || '',
          period: edu.period || edu.graduationYear || '',
          gpa: edu.gpa || edu.cgpa || ''
        };

        if (matchIndex !== -1) {
          if (edu.action === 'replace') newEducation[matchIndex] = eduItem;
          else if (edu.action === 'merge') {
            newEducation[matchIndex] = { ...newEducation[matchIndex], ...eduItem };
          }
        } else if (edu.action !== 'skip') {
          newEducation.push(eduItem);
        }
      });

      // Verified Experience merging
      const existingExperience = Array.isArray(prev.experience) ? [...prev.experience] : [];
      const newExperience = [...existingExperience];

      experience.forEach(exp => {
        const expRole = (exp.role || '').toLowerCase().trim();
        const expComp = (exp.company || '').toLowerCase().trim();
        const matchIndex = newExperience.findIndex(ex =>
          (ex.role || '').toLowerCase().trim() === expRole && (ex.company || '').toLowerCase().trim() === expComp
        );
        const expItem = {
          id: exp.id || `exp-ox-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          role: exp.role || '',
          company: exp.company || '',
          location: exp.location || '',
          period: exp.period || '',
          bullets: Array.isArray(exp.bullets) ? exp.bullets : (exp.description ? [exp.description] : [])
        };

        if (matchIndex !== -1) {
          if (exp.action === 'replace') newExperience[matchIndex] = expItem;
          else if (exp.action === 'merge') {
            const ex = newExperience[matchIndex];
            newExperience[matchIndex] = {
              ...ex,
              bullets: [...new Set([...(ex.bullets || []), ...(expItem.bullets || [])])]
            };
          }
        } else if (exp.action !== 'skip') {
          newExperience.push(expItem);
        }
      });

      // Projects merging
      const existingProjects = Array.isArray(prev.projects) ? [...prev.projects] : [];
      const newProjects = [...existingProjects];

      projects.forEach(p => {
        const pTitle = (p.title || p.name || '').toLowerCase().trim();
        const matchIndex = newProjects.findIndex(ex => (ex.title || ex.name || '').toLowerCase().trim() === pTitle);
        const projectItem = {
          id: p.id || `proj-ox-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          title: p.title || p.name,
          description: p.description || '',
          technologies: Array.isArray(p.technologies) ? p.technologies : [],
          link: p.link || ''
        };

        if (matchIndex !== -1) {
          if (p.action === 'replace') newProjects[matchIndex] = projectItem;
          else if (p.action === 'merge') {
            const ex = newProjects[matchIndex];
            newProjects[matchIndex] = {
              ...ex,
              description: `${ex.description}\n${projectItem.description}`,
              technologies: [...new Set([...(ex.technologies || []), ...(projectItem.technologies || [])])],
              link: ex.link || projectItem.link
            };
          }
        } else if (p.action !== 'skip') {
          newProjects.push(projectItem);
        }
      });

      // Skills merging
      const existingSkills = prev.skills || {};
      let updatedSkills = { ...existingSkills };

      if (Array.isArray(skills) && skills.length > 0) {
        if (Array.isArray(existingSkills.languages) || Array.isArray(existingSkills.frameworks) || Array.isArray(existingSkills.tools)) {
          updatedSkills = {
            languages: [...new Set([...(existingSkills.languages || []), ...skills.filter(s => s.type === 'language').map(s => s.name || s)])],
            frameworks: [...new Set([...(existingSkills.frameworks || []), ...skills.filter(s => s.type === 'framework').map(s => s.name || s)])],
            tools: [...new Set([...(existingSkills.tools || []), ...skills.filter(s => s.type === 'tool').map(s => s.name || s)])]
          };
        } else if (Array.isArray(existingSkills)) {
          const oxCatName = 'OpportunityX Verified Skills';
          const oxItems = skills.map(s => typeof s === 'string' ? s : (s.name || s));
          const catIndex = existingSkills.findIndex(c => (c.category || '').toLowerCase() === oxCatName.toLowerCase());

          if (catIndex !== -1) {
            const cat = existingSkills[catIndex];
            const mergedItems = [...new Set([...(cat.items || []), ...oxItems])];
            const nextArr = [...existingSkills];
            nextArr[catIndex] = { ...cat, items: mergedItems };
            updatedSkills = nextArr;
          } else {
            updatedSkills = [
              ...existingSkills,
              { id: `cat-ox-${Date.now()}`, category: oxCatName, items: oxItems }
            ];
          }
        } else {
          updatedSkills = {
            languages: skills.filter(s => s.type === 'language' || !s.type).map(s => s.name || s),
            frameworks: skills.filter(s => s.type === 'framework').map(s => s.name || s),
            tools: skills.filter(s => s.type === 'tool').map(s => s.name || s)
          };
        }
      }

      // Verified Certificates merging
      const existingCerts = Array.isArray(prev.certificates) ? [...prev.certificates] : [];
      const newCerts = [...existingCerts];
      certificates.forEach(c => {
        const cName = (c.name || '').toLowerCase().trim();
        const matchIndex = newCerts.findIndex(ex => (ex.name || '').toLowerCase().trim() === cName);
        const certItem = {
          id: c.id || `cert-ox-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: c.name || '',
          issuer: c.issuer || 'OpportunityX Academy',
          date: c.date || '',
          link: c.link || ''
        };

        if (matchIndex !== -1) {
          if (c.action === 'replace') newCerts[matchIndex] = certItem;
        } else if (c.action !== 'skip') {
          newCerts.push(certItem);
        }
      });

      // Achievements & Hackathons merging
      const existingAch = Array.isArray(prev.achievements) ? [...prev.achievements] : [];
      const newAch = [...existingAch];
      achievements.forEach(a => {
        const aTitle = (a.title || '').toLowerCase().trim();
        const matchIndex = newAch.findIndex(ex => (ex.title || '').toLowerCase().trim() === aTitle);
        const achItem = {
          id: a.id || `ach-ox-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          title: a.title || '',
          description: a.description || ''
        };
        if (matchIndex === -1 && a.action !== 'skip') {
          newAch.push(achItem);
        }
      });

      return {
        ...prev,
        personal: updatedPersonal,
        assets: updatedAssets,
        education: newEducation,
        experience: newExperience,
        projects: newProjects,
        skills: updatedSkills,
        certificates: newCerts,
        achievements: newAch,
        metadata: {
          ...prev.metadata,
          lastSaved: new Date().toISOString()
        }
      };
    });

    setIsOpportunityXImportModalOpen(false);
  }, [updateActiveResume]);

  const updatePersonal = (field, value) => updateActiveResume((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  const updateExperience = (items) => updateActiveResume((prev) => ({ ...prev, experience: items }));
  const updateEducation = (items) => updateActiveResume((prev) => ({ ...prev, education: items }));
  const updateProjects = (items) => updateActiveResume((prev) => ({ ...prev, projects: items }));
  const updateSkills = (skillsObj) => updateActiveResume((prev) => ({ ...prev, skills: skillsObj }));
  const updateCertificates = (items) => updateActiveResume((prev) => ({ ...prev, certificates: items }));
  const updateAchievements = (items) => updateActiveResume((prev) => ({ ...prev, achievements: items }));
  const updateLanguages = (items) => updateActiveResume((prev) => ({ ...prev, languages: items }));
  const updateSocialLinks = (field, value) => updateActiveResume((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [field]: value } }));
  const updateCustomSections = (items) => updateActiveResume((prev) => ({ ...prev, customSections: items }));

  const setTemplate = (templateName) => updateActiveResume((prev) => {
    const caps = getTemplateCapabilities(templateName);
    const isPhoto = caps.supportsPhoto;
    const defaultVisiblePos = caps.supportedPhotoPositions?.find(p => p !== 'hidden') || 'sidebar';

    let nextPhotoPosition = prev.assets?.photoPosition;
    if (isPhoto) {
      if (!nextPhotoPosition || nextPhotoPosition === 'hidden' || !caps.supportedPhotoPositions?.includes(nextPhotoPosition)) {
        nextPhotoPosition = defaultVisiblePos;
      }
    } else {
      nextPhotoPosition = 'hidden';
    }

    const updatedAssets = {
      ...(prev.assets || {}),
      photoPosition: nextPhotoPosition,
      profilePhoto: (isPhoto && !prev.assets?.profilePhoto) ? DEFAULT_PROFILE_PHOTO : (prev.assets?.profilePhoto || DEFAULT_PROFILE_PHOTO)
    };

    return {
      ...prev,
      assets: updatedAssets,
      metadata: { ...prev.metadata, template: templateName }
    };
  });
  const setFontFamily = (fontName) => updateActiveResume((prev) => ({ ...prev, metadata: { ...prev.metadata, fontFamily: fontName } }));
  const setAccentColor = (colorHex) => updateActiveResume((prev) => ({ ...prev, metadata: { ...prev.metadata, accentColor: colorHex } }));

  return (
    <ResumeContext.Provider
      value={{
        session,
        handleLogin,
        handleLogout,
        checkAIAccess,
        addPurchasedCredits,
        resumes,
        activeResume,
        activeResumeId,
        setActiveResumeId,
        createNewResume,
        duplicateResume,
        deleteResume,
        renameResume,
        toggleFavorite,
        toggleArchive,
        toggleSectionVisibility,
        updateAssets,
        updateStyle,
        applyResumePreset,
        hasRecoveryDraft,
        restoreRecoveryDraft,
        discardRecoveryDraft,
        userPreferences,
        updateUserPreferences,
        selectedAIModel,
        setSelectedAIModel,
        updateActiveResume,
        saveStatus,
        lastSavedTimeStr,
        resumeHealth,
        atsEngineResult,
        validationResult,
        keywordResult,
        recruiterScanResult,
        resumeStrengthScore,
        strengthLabel,
        scanHistory,
        runResumeScan,
        past,
        future,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
        undo,
        redo,
        loadDemoResume,
        importResumeData,
        versions: activeVersions,
        createVersionSnapshot,
        restoreVersionSnapshot,
        aiCredits,
        consumeCredit,
        byokKeys,
        saveByokKeys,
        exportActiveResumeJSON,
        importResumeJSON,
        updatePersonal,
        updateExperience,
        updateEducation,
        updateProjects,
        updateSkills,
        updateCertificates,
        updateAchievements,
        updateLanguages,
        updateSocialLinks,
        updateCustomSections,
        setTemplate,
        setFontFamily,
        setAccentColor,
        isKeyboardHelpOpen,
        setIsKeyboardHelpOpen,
        isBYOKModalOpen,
        setIsBYOKModalOpen,
        isAIUpgradePromptOpen,
        setIsAIUpgradePromptOpen,
        isUnlockAIModalOpen,
        setIsUnlockAIModalOpen,
        isBuyCreditsModalOpen,
        setIsBuyCreditsModalOpen,
        isAICreditsModalOpen,
        setIsAICreditsModalOpen,
        isAuthOpen,
        setIsAuthOpen,
        isInspectorOpen,
        setIsInspectorOpen,
        isAssetManagerOpen,
        setIsAssetManagerOpen,
        isExportCenterOpen,
        setIsExportCenterOpen,
        isThemeCustomizerOpen,
        setIsThemeCustomizerOpen,
        isProfilePresetsOpen,
        setIsProfilePresetsOpen,
        isComparisonOpen,
        setIsComparisonOpen,
        isScanHistoryOpen,
        setIsScanHistoryOpen,
        isCompanyMatchOpen,
        setIsCompanyMatchOpen,
        isDonationModalOpen,
        setIsDonationModalOpen,
        isGitHubImportModalOpen,
        setIsGitHubImportModalOpen,
        importGitHubData,
        isOpportunityXImportModalOpen,
        setIsOpportunityXImportModalOpen,
        importOpportunityXData
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResume must be used within a ResumeProvider');
  return context;
};

