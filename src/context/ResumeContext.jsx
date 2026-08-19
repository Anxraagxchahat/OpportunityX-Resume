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
import { executeOpenRouterRequest } from '../services/ai/providerManager';

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

import { cleanDateString, hydrateAndNormalizeResume, ensureResumeItemIds } from '../utils/dateSanitizer';
import { getPendingReferralCode, clearPendingReferralCode } from '../utils/referralAttribution';

// Re-export for backward compatibility
export { cleanDateString, hydrateAndNormalizeResume, ensureResumeItemIds };

export const ResumeProvider = ({ children }) => {
  // 0. Firebase Auth Integration
  const { user: firebaseUser, isAuthenticated: fbIsAuth, logout: fbLogout } = useAuth();

  // Derive session from Firebase auth state
  const [session, setSession] = useState(() => mapFirebaseUserToSession(null));
  const [persistenceMode, setPersistenceMode] = useState(() => (firebaseUser ? 'cloud' : 'local'));
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Guest -> Cloud Migration State
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);
  const [localGuestResumes, setLocalGuestResumes] = useState([]);
  const [isMigrating, setIsMigrating] = useState(false);

  // Authoritative AI Credits State (0 for guests; synced per UID from Supabase)
  const [aiCredits, setAiCredits] = useState({
    remaining: 0,
    totalPurchased: 0,
    usageHistory: []
  });

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

  // Sync session, AI credits & Cloud Resumes whenever Firebase auth state changes
  useEffect(() => {
    const newSession = mapFirebaseUserToSession(firebaseUser);
    setSession(newSession);
    cacheSession(newSession);

    if (firebaseUser) {
      setPersistenceMode('cloud');

      // 1. Sync User with Backend & Fetch Authoritative Credit Balance
      const syncUserAndCredits = async () => {
        try {
          await apiService.syncAuth().catch((err) => {
            console.warn("[CloudSync] Backend auth sync notice:", err.message);
          });

          // Check if there is a pending referral code to redeem
          const pendingRef = getPendingReferralCode();
          if (pendingRef) {
            try {
              const redeemRes = await apiService.redeemReferralCode(pendingRef);
              if (redeemRes && redeemRes.ok) {
                console.log("[Referral] Successfully redeemed pending referral:", pendingRef);
              }
            } catch (refErr) {
              console.warn("[Referral] Pending referral redemption note:", refErr.message);
            } finally {
              clearPendingReferralCode();
            }
          }

          let walletData = await apiService.getCreditBalance();
          if (walletData && typeof walletData.remaining_credits === 'number') {
            if (!walletData.has_claimed_welcome) {
              try {
                walletData = await apiService.claimWelcomeCredits();
              } catch (e) {}
            }
            const txList = await apiService.getCreditTransactions().catch(() => []);
            const calculatedUsed = (txList || []).filter(t => t.credits_changed < 0).reduce((acc, t) => acc + Math.abs(t.credits_changed), 0);
            setAiCredits({
              remaining: walletData.remaining_credits,
              totalPurchased: walletData.total_purchased || 0,
              totalUsed: walletData.total_used ?? calculatedUsed,
              usageHistory: txList || []
            });
          }
        } catch (e) {
          console.warn("[CloudSync] Credit balance hydration notice:", e);
        }
      };
      syncUserAndCredits();

      // 2. Hydrate Cloud Resumes from Supabase / Backend
      setIsCloudSyncing(true);
      apiService.getResumes().then(async (cloudList) => {
        setIsCloudSyncing(false);
        let validCloudResumes = [];
        if (Array.isArray(cloudList) && cloudList.length > 0) {
          validCloudResumes = cloudList.map(r => hydrateAndNormalizeResume({
            ...r.content,
            metadata: {
              ...(r.content?.metadata || {}),
              id: r.id,
              uuid: r.id,
              title: r.title || r.content?.metadata?.title || 'Untitled Resume',
              template: r.template_id || r.content?.metadata?.template || 'modern',
              font: r.font_family || r.content?.metadata?.font || 'Inter',
              accentColor: r.accent_color || r.content?.metadata?.accentColor || '#F97316',
              lastSaved: r.updated_at || new Date().toISOString()
            }
          }));
        }

        // Check if un-migrated guest resumes exist in localStorage
        try {
          const guestSaved = localStorage.getItem(STORAGE_COLLECTION_KEY);
          const hasMigratedBefore = localStorage.getItem(`ox_migrated_${firebaseUser.uid}`);
          if (guestSaved && !hasMigratedBefore) {
            const parsedGuest = JSON.parse(guestSaved);
            if (Array.isArray(parsedGuest) && parsedGuest.length > 0) {
              const hasCustomContent = parsedGuest.some(r =>
                r.personal?.fullName || (r.experience && r.experience.length > 0) || (r.education && r.education.length > 0)
              );
              if (hasCustomContent) {
                setLocalGuestResumes(parsedGuest);
                setIsMigrationModalOpen(true);
              }
            }
          }
        } catch (e) {}

        if (validCloudResumes.length > 0) {
          setResumes(validCloudResumes);
          setActiveResumeIdState(validCloudResumes[0].metadata.id);
        } else {
          // If no cloud resumes yet and no guest resumes, create first cloud resume
          const initialTitle = 'My Resume';
          const newId = `res_${Date.now()}`;
          const blankResume = {
            ...emptyResumeSchema,
            metadata: { ...emptyResumeSchema.metadata, id: newId, uuid: newId, title: initialTitle, template: 'modern', lastSaved: new Date().toISOString() }
          };
          apiService.createResume({
            id: newId,
            title: initialTitle,
            content: blankResume,
            template_id: 'modern'
          }).then(created => {
            const formatted = hydrateAndNormalizeResume({
              ...created.content,
              metadata: { ...created.content.metadata, id: created.id, uuid: created.id, title: created.title, template: created.template_id }
            });
            setResumes([formatted]);
            setActiveResumeIdState(created.id);
          }).catch(err => {
            console.warn('[CloudSync] Fallback initial resume creation:', err);
            setResumes([blankResume]);
            setActiveResumeIdState(newId);
          });
        }
      }).catch((err) => {
        setIsCloudSyncing(false);
        console.warn("[CloudSync] Failed to fetch cloud resumes:", err);
      });

    } else {
      // Guest Mode: Reset to isolated guest state & 0 AI credits
      setPersistenceMode('local');
      setAiCredits({
        remaining: 0,
        totalPurchased: 0,
        usageHistory: []
      });

      try {
        const saved = localStorage.getItem(STORAGE_COLLECTION_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const guestResumes = parsed.map(r => hydrateAndNormalizeResume(r));
            setResumes(guestResumes);
            const savedActiveId = localStorage.getItem(ACTIVE_ID_KEY);
            setActiveResumeIdState(savedActiveId && guestResumes.some(r => r.metadata?.id === savedActiveId) ? savedActiveId : guestResumes[0].metadata.id);
            return;
          }
        }
      } catch (e) {}

      const defaultGuest = hydrateAndNormalizeResume({
        ...emptyResumeSchema,
        metadata: { ...emptyResumeSchema.metadata, id: 'ox-resume-initial', uuid: 'ox-resume-initial', title: 'My Resume' }
      });
      setResumes([defaultGuest]);
      setActiveResumeIdState('ox-resume-initial');
    }
  }, [firebaseUser]);

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
  const [saveStatus, setSaveStatus] = useState('Saved');
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
  const ENV_OPENROUTER_KEY = (import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_KEY || '').trim();
  const [byokKeys, setByokKeys] = useState(() => {
    try {
      const saved = localStorage.getItem(BYOK_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedOpenRouter = parsed?.openrouter?.trim();
        return {
          openai: parsed?.openai || '',
          gemini: parsed?.gemini || '',
          openrouter: (savedOpenRouter && savedOpenRouter.length > 8) ? savedOpenRouter : ENV_OPENROUTER_KEY,
          anthropic: parsed?.anthropic || ''
        };
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
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isDownloadSuccessModalOpen, setIsDownloadSuccessModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isGitHubImportModalOpen, setIsGitHubImportModalOpen] = useState(false);
  const [isOpportunityXImportModalOpen, setIsOpportunityXImportModalOpen] = useState(false);

  // ──────────────────────────────────────────
  // Auto-Save Effect (Hybrid Mode)
  // ──────────────────────────────────────────
  useEffect(() => {
    setSaveStatus('Saving...');
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const timer = setTimeout(() => {
      const activeObj = resumes.find(r => r.metadata?.id === activeResumeId || r.metadata?.uuid === activeResumeId) || resumes[0];

      if (firebaseUser) {
        // Authenticated: Save to Supabase Cloud
        if (activeObj && activeResumeId) {
          apiService.updateResume(activeResumeId, {
            title: activeObj.metadata?.title || 'Untitled Resume',
            content: activeObj,
            template_id: activeObj.metadata?.template || 'modern',
            font_family: activeObj.metadata?.font || 'Inter',
            accent_color: activeObj.metadata?.accentColor || '#F97316'
          }).then(() => {
            setSaveStatus('Saved to OpportunityX Cloud');
            setLastSavedTimeStr(nowStr);
          }).catch((err) => {
            console.warn('[CloudSync] Cloud auto-save warning:', err.message);
            setSaveStatus('Saved Offline (Sync Pending)');
            setLastSavedTimeStr(nowStr);
          });
        }
        try {
          localStorage.setItem(`ox_cloud_cache_${firebaseUser.uid}`, JSON.stringify(resumes));
        } catch (e) {}
      } else {
        // Guest: Save to LocalStorage
        try {
          localStorage.setItem(STORAGE_COLLECTION_KEY, JSON.stringify(resumes));
          localStorage.setItem(ACTIVE_ID_KEY, activeResumeId);
          setSaveStatus('Saved to LocalStorage');
          setLastSavedTimeStr(nowStr);
        } catch (e) {
          setSaveStatus('Storage limit reached');
        }
      }
    }, firebaseUser ? 1000 : 400);

    return () => clearTimeout(timer);
  }, [resumes, activeResumeId, firebaseUser]);

  useEffect(() => { try { localStorage.setItem(VERSIONS_KEY, JSON.stringify(versionMap)); } catch (e) {} }, [versionMap]);
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
    const newId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const title = customTitle || `New ${template.charAt(0).toUpperCase() + template.slice(1)} Resume`;
    const newResume = {
      ...emptyResumeSchema,
      metadata: { ...emptyResumeSchema.metadata, id: newId, uuid: newId, title, template, lastSaved: new Date().toISOString() }
    };

    if (firebaseUser) {
      apiService.createResume({
        id: newId,
        title,
        content: newResume,
        template_id: template,
        font_family: 'Inter',
        accent_color: '#F97316'
      }).then((created) => {
        const formatted = hydrateAndNormalizeResume({
          ...created.content,
          metadata: { ...created.content.metadata, id: created.id, uuid: created.id, title: created.title, template: created.template_id }
        });
        setResumes((prev) => [formatted, ...prev.filter(r => r.metadata?.id !== newId)]);
        setActiveResumeIdState(created.id);
      }).catch((err) => {
        console.warn('[CloudSync] Fallback creation:', err);
      });
    }

    setResumes((prev) => [newResume, ...prev]);
    setActiveResumeIdState(newId);
    setPast([]);
    setFuture([]);
    trackEvent(AnalyticsEvents.RESUME_CREATED, { id: newId, template });
    return newId;
  }, [firebaseUser]);

  const importResumeData = useCallback((importedSchema) => {
    if (!importedSchema || !importedSchema.metadata) return;
    const normalizedSchema = hydrateAndNormalizeResume(importedSchema);
    const newId = normalizedSchema.metadata.id || `res_${Date.now()}`;
    const formatted = {
      ...normalizedSchema,
      metadata: { ...normalizedSchema.metadata, id: newId, uuid: newId, lastSaved: new Date().toISOString() }
    };

    if (firebaseUser) {
      apiService.createResume({
        id: newId,
        title: formatted.metadata.title || 'Imported Resume',
        content: formatted,
        template_id: formatted.metadata.template || 'modern'
      }).catch(() => {});
    }

    setResumes((prev) => [formatted, ...prev]);
    setActiveResumeIdState(newId);
    setPast([]);
    setFuture([]);
    return newId;
  }, [firebaseUser]);

  const duplicateResume = useCallback((idToDuplicate) => {
    const target = resumes.find((r) => r.metadata?.id === idToDuplicate) || activeResume;
    const newId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const duplicated = JSON.parse(JSON.stringify(target));
    duplicated.metadata.id = newId;
    duplicated.metadata.uuid = newId;
    duplicated.metadata.title = `${target.metadata.title} (Copy)`;
    duplicated.metadata.lastSaved = new Date().toISOString();

    if (firebaseUser) {
      apiService.createResume({
        id: newId,
        title: duplicated.metadata.title,
        content: duplicated,
        template_id: duplicated.metadata.template || 'modern'
      }).catch(() => {});
    }

    setResumes((prev) => [duplicated, ...prev]);
    setActiveResumeIdState(newId);
    setPast([]);
    setFuture([]);
    trackEvent(AnalyticsEvents.RESUME_DUPLICATED, { originalId: idToDuplicate, newId });
    return newId;
  }, [resumes, activeResume, firebaseUser]);

  const deleteResume = useCallback((idToDelete) => {
    if (firebaseUser) {
      apiService.deleteResume(idToDelete).catch((err) => {
        console.warn('[CloudSync] Delete cloud resume warning:', err);
      });
    }

    if (resumes.length <= 1) {
      const newId = `res_${Date.now()}`;
      const blank = { ...emptyResumeSchema, metadata: { ...emptyResumeSchema.metadata, id: newId, uuid: newId, title: "My Resume" } };
      if (firebaseUser) {
        apiService.createResume({ id: newId, title: "My Resume", content: blank, template_id: "modern" }).catch(() => {});
      }
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
  }, [resumes, activeResumeId, firebaseUser]);

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

  const updateAssets = useCallback((arg1, arg2) => {
    updateActiveResume((prev) => {
      const current = prev.assets || {};
      const next = typeof arg1 === 'string'
        ? { ...current, [arg1]: arg2 }
        : { ...current, ...(arg1 || {}) };
      return { ...prev, assets: next };
    });
  }, [updateActiveResume]);

  const updateStyle = useCallback((arg1, arg2) => {
    updateActiveResume((prev) => {
      const current = prev.style || {};
      const next = typeof arg1 === 'string'
        ? { ...current, [arg1]: arg2 }
        : { ...current, ...(arg1 || {}) };
      return { ...prev, style: next };
    });
  }, [updateActiveResume]);

  const applyResumePreset = useCallback((preset) => {
    if (!preset) return;
    updateActiveResume((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        template: preset.template || prev.metadata.template,
        font: preset.font || prev.metadata.font,
        accentColor: preset.accentColor || prev.metadata.accentColor,
        presetId: preset.id
      }
    }));
  }, [updateActiveResume]);

  // History & Undo / Redo
  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setFuture((f) => [activeResume, ...f]);
    setPast(newPast);
    setResumes((prev) => prev.map((r) => (r.metadata?.id === activeResumeId ? previous : r)));
  }, [past, activeResume, activeResumeId]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast((p) => [...p, activeResume]);
    setFuture(newFuture);
    setResumes((prev) => prev.map((r) => (r.metadata?.id === activeResumeId ? next : r)));
  }, [future, activeResume, activeResumeId]);

  const loadDemoResume = useCallback(() => {
    setPast((p) => [...p, activeResume]);
    setFuture([]);
    const demo = hydrateAndNormalizeResume({
      ...defaultResumeData,
      metadata: { ...defaultResumeData.metadata, id: activeResumeId, uuid: activeResumeId, lastSaved: new Date().toISOString() }
    });
    setResumes((prev) => prev.map((r) => (r.metadata?.id === activeResumeId ? demo : r)));
  }, [activeResume, activeResumeId]);

  // Version Snapshots
  const activeVersions = useMemo(() => versionMap[activeResumeId] || [], [versionMap, activeResumeId]);

  const createVersionSnapshot = useCallback((customTitle = '') => {
    const versionNum = (versionMap[activeResumeId]?.length || 0) + 1;
    const newSnapshot = {
      id: `v${versionNum}-${Date.now()}`,
      versionNumber: versionNum,
      title: customTitle || `Snapshot ${versionNum}`,
      timestamp: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(activeResume))
    };
    setVersionMap((prev) => ({
      ...prev,
      [activeResumeId]: [newSnapshot, ...(prev[activeResumeId] || [])]
    }));
    return newSnapshot;
  }, [versionMap, activeResume, activeResumeId]);

  const restoreVersionSnapshot = useCallback((snapshotId) => {
    const target = activeVersions.find((v) => v.id === snapshotId);
    if (target && target.data) {
      setPast((p) => [...p, activeResume]);
      setFuture([]);
      setResumes((prev) => prev.map((r) => (r.metadata?.id === activeResumeId ? target.data : r)));
    }
  }, [activeVersions, activeResume, activeResumeId]);

  // Gate check before running any AI feature
  const checkAIAccess = useCallback((featureName = 'AI Feature') => {
    // If user has configured custom BYOK key, allow immediate execution
    const hasBYOK = Boolean(byokKeys?.openrouter?.trim() && byokKeys.openrouter.trim().length > 10);
    if (hasBYOK) {
      return true;
    }

    if (aiCredits.remaining > 0) {
      return true;
    }

    if (!session || !session.isAuthenticated || session.isGuest) {
      setIsUnlockAIModalOpen(true);
      return false;
    }

    if (aiCredits.remaining <= 0) {
      setIsBuyCreditsModalOpen(true);
      return false;
    }

    return true;
  }, [session, aiCredits.remaining, byokKeys]);

  // Authoritative Credit Refresh from Backend Ledger
  const refreshCreditBalance = useCallback(async () => {
    if (!firebaseUser) return { remaining: 0, totalPurchased: 0, totalUsed: 0, usageHistory: [] };
    try {
      const walletData = await apiService.getCreditBalance();
      const txList = await apiService.getCreditTransactions().catch(() => []);
      const calculatedUsed = (txList || []).filter(t => t.credits_changed < 0).reduce((acc, t) => acc + Math.abs(t.credits_changed), 0);
      const updated = {
        remaining: walletData.remaining_credits || 0,
        totalPurchased: walletData.total_purchased || 0,
        totalUsed: walletData.total_used ?? calculatedUsed,
        usageHistory: txList || []
      };
      setAiCredits(updated);
      return updated;
    } catch (e) {
      console.warn('[Credits] Failed to refresh credit balance:', e);
    }
    return aiCredits;
  }, [firebaseUser, aiCredits]);

  // Central Authoritative AI Execution Function (Secure Server-Side Proxy + Dual BYOK)
  const executeAIGeneration = useCallback(async ({
    feature = 'summary',
    prompt = '',
    content = {},
    model = null,
    targetRole = null,
    targetJobDescription = null
  } = {}) => {
    const customByokKey = byokKeys?.openrouter?.trim();
    const isUsingBYOK = Boolean(customByokKey && customByokKey.length > 10);

    // If using OpportunityX Credits, enforce user authentication & balance
    if (!isUsingBYOK) {
      if (!firebaseUser || !session.isAuthenticated || session.isGuest) {
        setIsUnlockAIModalOpen(true);
        throw new Error('Please log in to use OpportunityX AI Resume Assistant.');
      }
      if (aiCredits.remaining <= 0) {
        setIsBuyCreditsModalOpen(true);
        throw new Error('Insufficient AI Credits. Please purchase credits or configure your personal API key in AI Settings.');
      }
    }

    const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const effectiveTargetRole = targetRole || activeResume?.personal?.targetRole || activeResume?.personal?.jobTitle || 'Software Engineer';

    // Call server-side generation proxy
    try {
      const response = await apiService.generateAI({
        feature,
        prompt,
        content,
        model: model || selectedAIModel || 'google/gemini-2.5-flash',
        targetRole: effectiveTargetRole,
        targetJobDescription,
        requestId,
        byokKey: isUsingBYOK ? customByokKey : undefined
      });

      if (response && response.success) {
        // Authoritatively update credit counts from server response immediately
        if (typeof response.remaining_credits === 'number') {
          setAiCredits((prev) => ({
            ...prev,
            remaining: response.remaining_credits,
            totalUsed: response.total_used ?? ((prev.totalUsed || 0) + (response.credits_deducted || 0)),
            totalPurchased: response.total_purchased ?? prev.totalPurchased
          }));
        }
        return response;
      }

      throw new Error(response?.detail || response?.message || 'AI generation failed.');
    } catch (serverErr) {
      console.warn('[ResumeContext] Server AI generation failed, checking client fallback:', serverErr);

      // Fallback: If backend is missing key or fails on Render, fallback to client-side OpenRouter
      const fallbackKey = customByokKey || import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.OPENROUTER_API_KEY;
      if (fallbackKey && typeof fallbackKey === 'string' && fallbackKey.trim().length > 10) {
        console.info('[ResumeContext] Executing resilient client OpenRouter generation...');
        let userPrompt = prompt;
        if (!userPrompt || !userPrompt.trim()) {
          if (feature === 'summary') {
            userPrompt = `Write a high-impact, 3-4 sentence professional executive summary for a ${effectiveTargetRole}. Background / skills: ${JSON.stringify(content?.skills || {})}. Current summary: ${content?.existingSummary || ''}`;
          } else if (feature === 'bullet') {
            userPrompt = `Generate 3 strong, action-driven resume bullet points with quantifiable metrics for a ${effectiveTargetRole}. Context: ${JSON.stringify(content)}`;
          } else {
            userPrompt = `Improve and generate professional content for resume feature '${feature}' for a ${effectiveTargetRole}. Context: ${JSON.stringify(content)}`;
          }
        }

        const fallbackRes = await executeOpenRouterRequest({
          modelId: model || selectedAIModel || 'google/gemini-2.5-flash',
          systemPrompt: 'You are an expert executive resume writer and ATS optimization specialist. Return only the polished final text without markdown headings, introductions, or conversational preambles.',
          userPrompt,
          apiKey: fallbackKey
        });

        if (!isUsingBYOK) {
          setAiCredits((prev) => ({
            ...prev,
            remaining: Math.max(0, (prev.remaining || 10) - 1),
            totalUsed: (prev.totalUsed || 0) + 1
          }));
        }

        return {
          success: true,
          result: fallbackRes.generatedContent,
          feature,
          model_used: fallbackRes.modelId,
          credits_deducted: isUsingBYOK ? 0 : 1,
          remaining_credits: Math.max(0, (aiCredits.remaining || 10) - 1)
        };
      }

      throw serverErr;
    }
  }, [firebaseUser, session, aiCredits, byokKeys, selectedAIModel, activeResume]);

  const consumeCredit = useCallback(async (actionName = 'AI Feature', creditsToConsume = 1) => {
    const hasBYOK = Boolean(byokKeys?.openrouter?.trim() && byokKeys.openrouter.trim().length > 10);
    if (hasBYOK) return true;
    if (!firebaseUser) {
      if (aiCredits.remaining >= creditsToConsume) {
        setAiCredits((prev) => ({ ...prev, remaining: Math.max(0, prev.remaining - creditsToConsume) }));
        return true;
      }
      setIsUnlockAIModalOpen(true);
      return false;
    }
    try {
      const res = await apiService.consumeCredit(actionName, creditsToConsume);
      if (res && typeof res.remaining_credits === 'number') {
        setAiCredits((prev) => ({
          ...prev,
          remaining: res.remaining_credits,
          totalUsed: (prev.totalUsed || 0) + creditsToConsume
        }));
        return true;
      }
    } catch (e) {}
    return false;
  }, [firebaseUser, aiCredits, byokKeys]);

  const addPurchasedCredits = useCallback(async (creditsToAdd, description = 'Purchased Credits') => {
    return refreshCreditBalance();
  }, [refreshCreditBalance]);

  const saveByokKeys = useCallback((newKeys) => {
    setByokKeys((prev) => {
      const updated = typeof newKeys === 'function' ? newKeys(prev) : { ...prev, ...newKeys };
      try {
        localStorage.setItem(BYOK_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const clearByokKey = useCallback((provider = 'openrouter') => {
    setByokKeys((prev) => {
      const updated = { ...prev, [provider]: '' };
      try {
        localStorage.setItem(BYOK_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Guest to Cloud Migration Actions
  const migrateLocalResumesToCloud = useCallback(async () => {
    if (!firebaseUser || localGuestResumes.length === 0) {
      setIsMigrationModalOpen(false);
      return;
    }

    setIsMigrating(true);
    try {
      for (const guestRes of localGuestResumes) {
        const title = guestRes.metadata?.title || guestRes.personal?.fullName || 'Migrated Resume';
        const template = guestRes.metadata?.template || 'modern';
        const newId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        await apiService.createResume({
          id: newId,
          title,
          content: guestRes,
          template_id: template,
          font_family: guestRes.metadata?.font || 'Inter',
          accent_color: guestRes.metadata?.accentColor || '#F97316'
        });
      }

      // Re-fetch all cloud resumes
      const cloudList = await apiService.getResumes();
      if (Array.isArray(cloudList) && cloudList.length > 0) {
        const normalized = cloudList.map(r => hydrateAndNormalizeResume({
          ...r.content,
          metadata: {
            ...(r.content?.metadata || {}),
            id: r.id,
            uuid: r.id,
            title: r.title || r.content?.metadata?.title || 'Untitled Resume',
            template: r.template_id || r.content?.metadata?.template || 'modern',
            font: r.font_family || r.content?.metadata?.font || 'Inter',
            accentColor: r.accent_color || r.content?.metadata?.accentColor || '#F97316',
            lastSaved: r.updated_at || new Date().toISOString()
          }
        }));
        setResumes(normalized);
        setActiveResumeIdState(normalized[0].metadata.id);
      }

      localStorage.setItem(`ox_migrated_${firebaseUser.uid}`, 'true');
      setLocalGuestResumes([]);
      setIsMigrationModalOpen(false);
    } catch (err) {
      console.warn('[CloudSync] Migration error:', err);
    } finally {
      setIsMigrating(false);
    }
  }, [firebaseUser, localGuestResumes]);

  const dismissMigrationModal = useCallback(() => {
    if (firebaseUser) {
      localStorage.setItem(`ox_migrated_${firebaseUser.uid}`, 'dismissed');
    }
    setIsMigrationModalOpen(false);
  }, [firebaseUser]);

  const logout = useCallback(async () => {
    try {
      await fbLogout();
    } catch (e) {
      console.warn('Logout warning:', e);
    }
  }, [fbLogout]);

  const exportActiveResumeJSON = useCallback((clean = true) => {
    try {
      const dataToExport = clean ? stripInternalMetadata(activeResume) : activeResume;
      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      const safeTitle = (activeResume?.metadata?.title || activeResume?.personal?.fullName || 'resume')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');
      downloadAnchor.href = url;
      downloadAnchor.download = `${safeTitle}_opportunityx.json`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        downloadAnchor.remove();
      }, 100);
    } catch (err) {
      console.error('Failed to export JSON backup:', err);
    }
  }, [activeResume]);

  const importResumeJSON = useCallback((jsonContent) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || typeof parsed !== 'object') throw new Error("Invalid JSON structure");
      const newId = `res_${Date.now()}`;
      const imported = {
        ...emptyResumeSchema,
        ...parsed,
        metadata: { ...emptyResumeSchema.metadata, ...(parsed.metadata || {}), id: newId, uuid: newId, title: parsed.metadata?.title ? `${parsed.metadata.title} (Imported)` : "Imported Resume", lastSaved: new Date().toISOString() }
      };
      if (firebaseUser) {
        apiService.createResume({
          id: newId,
          title: imported.metadata.title,
          content: imported,
          template_id: imported.metadata.template || 'modern'
        }).catch(() => {});
      }
      setResumes((prev) => [imported, ...prev]);
      setActiveResumeIdState(newId);
      return true;
    } catch (err) {
      alert("Failed to import JSON file.");
      return false;
    }
  }, [firebaseUser]);

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
          description: p.description || '',
          bullets: p.bullets && p.bullets.length > 0 ? p.bullets : (p.description ? [p.description] : []),
          techStack: Array.isArray(p.techStack) ? p.techStack : (p.language ? [p.language] : []),
          liveUrl: p.homepage || p.liveUrl || '',
          githubUrl: p.htmlUrl || p.githubUrl || ''
        };

        if (matchIndex >= 0) {
          newProjects[matchIndex] = { ...newProjects[matchIndex], ...projectItem };
        } else {
          newProjects.push(projectItem);
        }
      });

      // Skills merging
      const existingSkills = prev.skills || { languages: [], frameworks: [], tools: [] };
      const mergedLanguages = Array.from(new Set([...(existingSkills.languages || []), ...(skills.languages || [])]));
      const mergedFrameworks = Array.from(new Set([...(existingSkills.frameworks || []), ...(skills.frameworks || [])]));
      const mergedTools = Array.from(new Set([...(existingSkills.tools || []), ...(skills.tools || [])]));

      return {
        ...prev,
        personal: updatedPersonal,
        projects: newProjects,
        skills: {
          languages: mergedLanguages,
          frameworks: mergedFrameworks,
          tools: mergedTools
        },
        metadata: {
          ...prev.metadata,
          importedFromGitHub: true,
          githubUsername: personal?.github || prev.metadata?.githubUsername
        }
      };
    });
  }, [updateActiveResume]);

  const importOpportunityXData = useCallback((payload) => {
    if (!payload) return;
    const { personal, experience = [], education = [], skills = {}, projects = [] } = payload;

    updateActiveResume((prev) => {
      const mergedPersonal = { ...(prev.personal || {}), ...(personal || {}) };

      const existingExp = Array.isArray(prev.experience) ? prev.experience : [];
      const newExp = [...existingExp];
      experience.forEach(exp => {
        if (!newExp.some(e => (e.company || '').toLowerCase() === (exp.company || '').toLowerCase())) {
          newExp.push({
            id: exp.id || `exp-ox-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            company: exp.company || '',
            role: exp.role || exp.title || '',
            title: exp.role || exp.title || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: exp.current || false,
            bullets: Array.isArray(exp.bullets) ? exp.bullets : []
          });
        }
      });

      const existingEdu = Array.isArray(prev.education) ? prev.education : [];
      const newEdu = [...existingEdu];
      education.forEach(edu => {
        if (!newEdu.some(e => (e.institution || '').toLowerCase() === (edu.institution || '').toLowerCase())) {
          newEdu.push({
            id: edu.id || `edu-ox-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            institution: edu.institution || '',
            degree: edu.degree || '',
            location: edu.location || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            gpa: edu.gpa || ''
          });
        }
      });

      const existingSkills = prev.skills || { languages: [], frameworks: [], tools: [] };
      const mergedSkills = {
        languages: Array.from(new Set([...(existingSkills.languages || []), ...(skills.languages || [])])),
        frameworks: Array.from(new Set([...(existingSkills.frameworks || []), ...(skills.frameworks || [])])),
        tools: Array.from(new Set([...(existingSkills.tools || []), ...(skills.tools || [])]))
      };

      const existingProj = Array.isArray(prev.projects) ? prev.projects : [];
      const newProj = [...existingProj];
      projects.forEach(p => {
        if (!newProj.some(ex => (ex.title || '').toLowerCase() === (p.title || '').toLowerCase())) {
          newProj.push({
            id: p.id || `proj-ox-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            title: p.title || '',
            description: p.description || '',
            bullets: Array.isArray(p.bullets) ? p.bullets : [],
            techStack: Array.isArray(p.techStack) ? p.techStack : [],
            liveUrl: p.liveUrl || '',
            githubUrl: p.githubUrl || ''
          });
        }
      });

      return {
        ...prev,
        personal: mergedPersonal,
        experience: newExp,
        education: newEdu,
        skills: mergedSkills,
        projects: newProj,
        metadata: {
          ...prev.metadata,
          importedFromOpportunityX: true
        }
      };
    });
  }, [updateActiveResume]);

  // Section Specific Updaters
  const updatePersonal = useCallback((arg1, arg2) => {
    updateActiveResume((prev) => {
      const current = prev.personal || {};
      let next;
      if (typeof arg1 === 'string') {
        next = { ...current, [arg1]: arg2 };
        if (arg1 === 'jobTitle' || arg1 === 'targetRole') {
          next.jobTitle = arg2;
          next.targetRole = arg2;
        }
      } else {
        next = { ...current, ...(arg1 || {}) };
        if (next.jobTitle && !next.targetRole) {
          next.targetRole = next.jobTitle;
        } else if (next.targetRole && !next.jobTitle) {
          next.jobTitle = next.targetRole;
        }
      }
      return { ...prev, personal: next };
    });
  }, [updateActiveResume]);

  const updateExperience = useCallback((expArray) => {
    updateActiveResume((prev) => ({ ...prev, experience: expArray }));
  }, [updateActiveResume]);

  const updateEducation = useCallback((eduArray) => {
    updateActiveResume((prev) => ({ ...prev, education: eduArray }));
  }, [updateActiveResume]);

  const updateProjects = useCallback((projArray) => {
    updateActiveResume((prev) => ({ ...prev, projects: projArray }));
  }, [updateActiveResume]);

  const updateSkills = useCallback((skillsObj) => {
    updateActiveResume((prev) => ({ ...prev, skills: skillsObj }));
  }, [updateActiveResume]);

  const updateCertificates = useCallback((certArray) => {
    updateActiveResume((prev) => ({ ...prev, certificates: certArray }));
  }, [updateActiveResume]);

  const updateAchievements = useCallback((achArray) => {
    updateActiveResume((prev) => ({ ...prev, achievements: achArray }));
  }, [updateActiveResume]);

  const updateLanguages = useCallback((langArray) => {
    updateActiveResume((prev) => ({ ...prev, languages: langArray }));
  }, [updateActiveResume]);

  const updateSocialLinks = useCallback((arg1, arg2) => {
    updateActiveResume((prev) => {
      const current = prev.socialLinks || {};
      const next = typeof arg1 === 'string'
        ? { ...current, [arg1]: arg2 }
        : { ...current, ...(arg1 || {}) };
      return { ...prev, socialLinks: next };
    });
  }, [updateActiveResume]);

  const updateCustomSections = useCallback((customArray) => {
    updateActiveResume((prev) => ({ ...prev, customSections: customArray }));
  }, [updateActiveResume]);

  const setTemplate = useCallback((templateId) => {
    updateActiveResume((prev) => {
      const caps = getTemplateCapabilities(templateId);
      const isTargetPhoto = Boolean(caps.supportsPhoto);
      const currentPhoto = prev.assets?.profilePhoto;

      // Preserve existing user photo; if template supports photo and no photo exists, provide DEFAULT_PROFILE_PHOTO
      let nextPhoto = currentPhoto;
      if (isTargetPhoto && (!currentPhoto || currentPhoto.trim() === '')) {
        nextPhoto = DEFAULT_PROFILE_PHOTO;
      }

      // Ensure photoPosition is valid for this template
      let nextPosition = prev.assets?.photoPosition;
      if (isTargetPhoto) {
        if (!nextPosition || nextPosition === 'hidden') {
          nextPosition = caps.supportedPhotoPositions?.find(p => p !== 'hidden') || 'top-right';
        }
      }

      return {
        ...prev,
        metadata: {
          ...(prev.metadata || {}),
          template: templateId,
          layoutId: caps.layoutId || prev.metadata?.layoutId
        },
        assets: {
          ...(prev.assets || {}),
          profilePhoto: nextPhoto,
          photoPosition: nextPosition || 'top-right'
        }
      };
    });
    trackEvent(AnalyticsEvents.TEMPLATE_SELECTED, { template: templateId });
  }, [updateActiveResume]);

  const setFontFamily = useCallback((font) => {
    updateActiveResume((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, font }
    }));
  }, [updateActiveResume]);

  const setAccentColor = useCallback((accentColor) => {
    updateActiveResume((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, accentColor }
    }));
  }, [updateActiveResume]);

  return (
    <ResumeContext.Provider
      value={{
        session,
        persistenceMode,
        isCloudSyncing,
        isMigrationModalOpen,
        setIsMigrationModalOpen,
        localGuestResumes,
        migrateLocalResumesToCloud,
        dismissMigrationModal,
        isMigrating,
        resumes,
        activeResumeId,
        activeResume,
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
        setAiCredits,
        consumeCredit,
        refreshCreditBalance,
        addPurchasedCredits,
        checkAIAccess,
        executeAIGeneration,
        byokKeys,
        saveByokKeys,
        clearByokKey,
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
        logout,
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
        isSupportModalOpen,
        setIsSupportModalOpen,
        isDownloadSuccessModalOpen,
        setIsDownloadSuccessModalOpen,
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
