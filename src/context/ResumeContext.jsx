import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { defaultResumeData, emptyResumeSchema } from '../data/sampleResume';
import { calculateResumeHealth } from '../utils/resumeHealth';
import { calculateATSScore } from '../utils/atsEngine';
import { validateResumeContent } from '../utils/validationEngine';
import { analyzeKeywords } from '../utils/keywordEngine';
import { simulateRecruiterGlance } from '../utils/recruiterSimulation';
import { trackEvent, AnalyticsEvents } from '../utils/analytics';
import { stripInternalMetadata } from '../utils/metadata';
import { getCurrentUserSession, loginUser, logoutUser, hasUserClaimedWelcomeCredits, markWelcomeCreditsClaimed } from '../services/ecosystem/authManager';

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

// Load OpenRouter key securely from environment configuration (.env)
const ENV_OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

export const ResumeProvider = ({ children }) => {
  // 0. User Auth Session State
  const [session, setSession] = useState(() => getCurrentUserSession());

  // 1. Resumes Collection State
  const [resumes, setResumes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COLLECTION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [defaultResumeData];
  });

  // 2. Active Resume ID State
  const [activeResumeId, setActiveResumeIdState] = useState(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_ID_KEY);
      if (savedId && resumes.some((r) => r.metadata?.id === savedId || r.metadata?.uuid === savedId)) {
        return savedId;
      }
    } catch (e) {}
    return resumes[0]?.metadata?.id || defaultResumeData.metadata.id;
  });

  // Derived Active Resume Object
  const activeResume = useMemo(() => {
    return resumes.find((r) => r.metadata?.id === activeResumeId || r.metadata?.uuid === activeResumeId) || resumes[0] || defaultResumeData;
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

  // Non-expiring AI Credits State
  const [aiCredits, setAiCredits] = useState(() => {
    try {
      const saved = localStorage.getItem(AI_CREDITS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          remaining: typeof parsed.remaining === 'number' ? parsed.remaining : 5,
          totalPurchased: parsed.totalPurchased || 0,
          usageHistory: Array.isArray(parsed.usageHistory) ? parsed.usageHistory : []
        };
      }
    } catch (e) {}
    return {
      remaining: 5,
      totalPurchased: 0,
      usageHistory: [
        { id: 'use-welcome', action: 'Welcome Credits Granted', timestamp: new Date().toISOString(), creditsUsed: 0 }
      ]
    };
  });

  // BYOK Keys loaded securely from environment (.env) or localStorage
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
      let targetTemplate = prev.metadata.template || 'modern';
      let targetProfile = prev.metadata.targetProfile || 'Software Developer';
      if (presetName === 'Fresher') { targetTemplate = 'student'; targetProfile = 'Fresher / Entry Level'; }
      else if (presetName === 'Experienced') { targetTemplate = 'executive'; targetProfile = 'Senior Engineer'; }
      else if (presetName === 'Student') { targetTemplate = 'student'; targetProfile = 'College Student'; }
      else if (presetName === 'International Resume') { targetTemplate = 'minimal'; targetProfile = 'Global Applicant'; }

      return { ...prev, metadata: { ...prev.metadata, template: targetTemplate, targetProfile } };
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

  // Auth Operations with Welcome Credit Handling
  const handleLogin = useCallback((email, provider = 'Email') => {
    const newSession = loginUser(email, provider);
    setSession(newSession);

    // If new user who hasn't claimed welcome credits, grant 5 Welcome AI Credits
    if (newSession.isFirstClaim) {
      setAiCredits((prev) => ({
        ...prev,
        remaining: (prev.remaining || 0) + 5,
        usageHistory: [
          {
            id: `welcome-${Date.now()}`,
            action: '5 Welcome AI Credits Granted',
            timestamp: new Date().toISOString(),
            creditsUsed: 0
          },
          ...prev.usageHistory
        ]
      }));
    }
    return newSession;
  }, []);

  const handleLogout = useCallback(() => {
    const guestSession = logoutUser();
    setSession(guestSession);
  }, []);

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

  const setTemplate = (templateName) => updateActiveResume((prev) => ({ ...prev, metadata: { ...prev.metadata, template: templateName } }));
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
        setIsDonationModalOpen
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

