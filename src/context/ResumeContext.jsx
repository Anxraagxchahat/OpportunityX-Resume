import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { defaultResumeData, emptyResumeSchema } from '../data/sampleResume';
import { calculateResumeHealth } from '../utils/resumeHealth';
import { trackEvent, AnalyticsEvents } from '../utils/analytics';

const ResumeContext = createContext(null);

const STORAGE_COLLECTION_KEY = 'opportunityx_resumes_collection_v2';
const ACTIVE_ID_KEY = 'opportunityx_active_resume_id_v2';
const VERSIONS_KEY = 'opportunityx_resume_versions_v2';
const AI_CREDITS_KEY = 'opportunityx_ai_credits_v1';
const BYOK_KEY = 'opportunityx_byok_keys_v1';

// Helper to calculate 1st of next month for credit reset
const getNextMonthFirstDay = () => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const ResumeProvider = ({ children }) => {
  // 1. Resumes Collection State
  const [resumes, setResumes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COLLECTION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse resumes from localStorage:", e);
    }
    return [defaultResumeData];
  });

  // 2. Active Resume ID State
  const [activeResumeId, setActiveResumeIdState] = useState(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_ID_KEY);
      if (savedId && resumes.some((r) => r.metadata?.id === savedId)) {
        return savedId;
      }
    } catch (e) {}
    return resumes[0]?.metadata?.id || defaultResumeData.metadata.id;
  });

  // Derived Active Resume Object
  const activeResume = useMemo(() => {
    return resumes.find((r) => r.metadata?.id === activeResumeId) || resumes[0] || defaultResumeData;
  }, [resumes, activeResumeId]);

  // Active Resume Health Calculation
  const resumeHealth = useMemo(() => {
    return calculateResumeHealth(activeResume);
  }, [activeResume]);

  // 3. Save Status & Timestamp State
  const [saveStatus, setSaveStatus] = useState('Saved to LocalStorage');
  const [lastSavedTimeStr, setLastSavedTimeStr] = useState('Just now');

  // 4. Undo / Redo Stacks (scoped to current session)
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // 5. Version History Snapshots (map of resumeId -> versions array)
  const [versionMap, setVersionMap] = useState(() => {
    try {
      const saved = localStorage.getItem(VERSIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      [defaultResumeData.metadata.id]: [
        {
          id: `v1-${Date.now()}`,
          versionNumber: 1,
          title: 'Initial Draft',
          timestamp: new Date().toISOString(),
          data: defaultResumeData
        }
      ]
    };
  });

  // 6. AI Credits Architecture State
  const [aiCredits, setAiCredits] = useState(() => {
    try {
      const saved = localStorage.getItem(AI_CREDITS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if reset is due
        const now = new Date();
        const resetTime = new Date(parsed.resetDate || now);
        if (now >= resetTime) {
          return {
            total: 5,
            remaining: 5,
            resetDate: getNextMonthFirstDay(),
            usageHistory: parsed.usageHistory || []
          };
        }
        return parsed;
      }
    } catch (e) {}
    return {
      total: 5,
      remaining: 5,
      resetDate: getNextMonthFirstDay(),
      usageHistory: [
        { id: 'use-1', action: 'Monthly Free AI Allocation', timestamp: new Date().toISOString(), creditsUsed: 0 }
      ]
    };
  });

  // 7. BYOK (Bring Your Own API Key) State
  const [byokKeys, setByokKeys] = useState(() => {
    try {
      const saved = localStorage.getItem(BYOK_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { openai: '', gemini: '', openrouter: '', anthropic: '' };
  });

  // Modals visibility states
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false);
  const [isBYOKModalOpen, setIsBYOKModalOpen] = useState(false);
  const [isAIUpgradePromptOpen, setIsAIUpgradePromptOpen] = useState(false);

  // Auto-Save Effect (Debounced write to LocalStorage)
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

  // Persist Versions, AI Credits & BYOK to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(VERSIONS_KEY, JSON.stringify(versionMap));
    } catch (e) {}
  }, [versionMap]);

  useEffect(() => {
    try {
      localStorage.setItem(AI_CREDITS_KEY, JSON.stringify(aiCredits));
    } catch (e) {}
  }, [aiCredits]);

  useEffect(() => {
    try {
      localStorage.setItem(BYOK_KEY, JSON.stringify(byokKeys));
    } catch (e) {}
  }, [byokKeys]);

  // Mutator for Active Resume with Undo stack push
  const updateActiveResume = useCallback((updater) => {
    setResumes((prevResumes) => {
      return prevResumes.map((r) => {
        if (r.metadata.id === activeResumeId) {
          const nextData = typeof updater === 'function' ? updater(r) : updater;
          // Push previous onto past stack
          setPast((p) => [...p.slice(-29), r]);
          setFuture([]);
          return {
            ...nextData,
            metadata: {
              ...nextData.metadata,
              lastSaved: new Date().toISOString()
            }
          };
        }
        return r;
      });
    });
  }, [activeResumeId]);

  // Set Active Resume Handler
  const setActiveResumeId = useCallback((id) => {
    if (resumes.some((r) => r.metadata?.id === id)) {
      setActiveResumeIdState(id);
      setPast([]);
      setFuture([]);
    }
  }, [resumes]);

  // CRUD Operations on Resumes Collection
  const createNewResume = useCallback((template = 'modern', customTitle = '') => {
    const newId = `ox-resume-${Date.now()}`;
    const title = customTitle || `New ${template.charAt(0).toUpperCase() + template.slice(1)} Resume`;
    const newResume = {
      ...emptyResumeSchema,
      metadata: {
        ...emptyResumeSchema.metadata,
        id: newId,
        title,
        template,
        lastSaved: new Date().toISOString()
      }
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
      // If deleting the last resume, replace with blank
      const newId = `ox-resume-${Date.now()}`;
      const blank = {
        ...emptyResumeSchema,
        metadata: { ...emptyResumeSchema.metadata, id: newId, title: "My Resume" }
      };
      setResumes([blank]);
      setActiveResumeIdState(newId);
    } else {
      const filtered = resumes.filter((r) => r.metadata.id !== idToDelete);
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
      prev.map((r) => (r.metadata.id === idToRename ? { ...r, metadata: { ...r.metadata, title: newTitle.trim() } } : r))
    );
    trackEvent(AnalyticsEvents.RESUME_RENAMED, { id: idToRename, newTitle });
  }, []);

  // Undo / Redo
  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setPast(newPast);
    setFuture((f) => [activeResume, ...f]);
    setResumes((prev) => prev.map((r) => (r.metadata.id === activeResumeId ? previous : r)));
  }, [past, activeResume, activeResumeId]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast((p) => [...p, activeResume]);
    setFuture(newFuture);
    setResumes((prev) => prev.map((r) => (r.metadata.id === activeResumeId ? next : r)));
  }, [future, activeResume, activeResumeId]);

  // Demo Resume Handler
  const loadDemoResume = useCallback(() => {
    const newId = `ox-resume-demo-${Date.now()}`;
    const demo = {
      ...defaultResumeData,
      metadata: {
        ...defaultResumeData.metadata,
        id: newId,
        title: "Alex Rivera - Full Stack Engineer Resume",
        lastSaved: new Date().toISOString()
      }
    };
    setResumes((prev) => [demo, ...prev]);
    setActiveResumeIdState(newId);
    setPast([]);
    setFuture([]);
    trackEvent(AnalyticsEvents.RESUME_CREATED, { id: newId, isDemo: true });
  }, []);

  // Version Snapshots for Active Resume
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
    setVersionMap((prev) => ({
      ...prev,
      [activeResumeId]: [newVersion, ...(prev[activeResumeId] || [])]
    }));
  }, [activeVersions, activeResume, activeResumeId]);

  const restoreVersionSnapshot = useCallback((versionId) => {
    const target = activeVersions.find((v) => v.id === versionId);
    if (target) {
      updateActiveResume(target.data);
    }
  }, [activeVersions, updateActiveResume]);

  // AI Credits Consumption Function
  const consumeCredit = useCallback((actionName = 'AI Feature') => {
    trackEvent(AnalyticsEvents.AI_BUTTON_CLICK, { actionName });
    if (aiCredits.remaining <= 0) {
      setIsAIUpgradePromptOpen(true);
      return false;
    }
    setAiCredits((prev) => {
      const nextRemaining = prev.remaining - 1;
      const usageEntry = {
        id: `use-${Date.now()}`,
        action: actionName,
        timestamp: new Date().toISOString(),
        creditsUsed: 1
      };
      return {
        ...prev,
        remaining: nextRemaining,
        usageHistory: [usageEntry, ...prev.usageHistory]
      };
    });
    trackEvent(AnalyticsEvents.AI_CREDIT_CONSUMED, { actionName });
    return true;
  }, [aiCredits]);

  // BYOK Key Saver
  const saveByokKeys = useCallback((newKeys) => {
    setByokKeys(newKeys);
  }, []);

  // JSON Export & Import
  const exportActiveResumeJSON = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeResume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activeResume.metadata.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_opportunityx.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    trackEvent(AnalyticsEvents.JSON_EXPORT, { id: activeResumeId });
  }, [activeResume, activeResumeId]);

  const importResumeJSON = useCallback((jsonContent) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || typeof parsed !== 'object') throw new Error("Invalid JSON structure");
      const newId = `ox-resume-import-${Date.now()}`;
      const imported = {
        ...emptyResumeSchema,
        ...parsed,
        metadata: {
          ...emptyResumeSchema.metadata,
          ...(parsed.metadata || {}),
          id: newId,
          title: parsed.metadata?.title ? `${parsed.metadata.title} (Imported)` : "Imported Resume",
          lastSaved: new Date().toISOString()
        }
      };
      setResumes((prev) => [imported, ...prev]);
      setActiveResumeIdState(newId);
      trackEvent(AnalyticsEvents.IMPORT_RESUME, { id: newId });
      return true;
    } catch (err) {
      console.error("Failed to import resume JSON:", err);
      alert("Failed to import resume JSON file. Please ensure it is a valid OpportunityX JSON Resume.");
      return false;
    }
  }, []);

  // Specialized Section Field Updaters
  const updatePersonal = (field, value) => {
    updateActiveResume((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const updateExperience = (experienceItems) => {
    updateActiveResume((prev) => ({ ...prev, experience: experienceItems }));
  };

  const updateEducation = (educationItems) => {
    updateActiveResume((prev) => ({ ...prev, education: educationItems }));
  };

  const updateProjects = (projectsItems) => {
    updateActiveResume((prev) => ({ ...prev, projects: projectsItems }));
  };

  const updateSkills = (skillsObj) => {
    updateActiveResume((prev) => ({ ...prev, skills: skillsObj }));
  };

  const updateCertificates = (certificatesItems) => {
    updateActiveResume((prev) => ({ ...prev, certificates: certificatesItems }));
  };

  const updateAchievements = (achievementsItems) => {
    updateActiveResume((prev) => ({ ...prev, achievements: achievementsItems }));
  };

  const updateLanguages = (languagesItems) => {
    updateActiveResume((prev) => ({ ...prev, languages: languagesItems }));
  };

  const updateSocialLinks = (field, value) => {
    updateActiveResume((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value }
    }));
  };

  const updateCustomSections = (customSectionsItems) => {
    updateActiveResume((prev) => ({ ...prev, customSections: customSectionsItems }));
  };

  // Metadata Updaters
  const setTemplate = (templateName) => {
    updateActiveResume((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, template: templateName }
    }));
    trackEvent(AnalyticsEvents.TEMPLATE_SELECTED, { template: templateName });
  };

  const setFontFamily = (fontName) => {
    updateActiveResume((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, fontFamily: fontName }
    }));
  };

  const setAccentColor = (colorHex) => {
    updateActiveResume((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, accentColor: colorHex }
    }));
  };

  // 8. Keyboard Shortcuts Event Listener Hook
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const targetTag = e.target?.tagName?.toLowerCase();
      const isInput = targetTag === 'input' || targetTag === 'textarea' || e.target?.isContentEditable;

      // Ctrl + S (Save snapshot manually)
      if (isCtrlOrCmd && e.key.toLowerCase() === 's') {
        e.preventDefault();
        createVersionSnapshot("Manual Save (Ctrl+S)");
        setSaveStatus('Snapshot Saved!');
        trackEvent(AnalyticsEvents.KEYBOARD_SHORTCUT_USED, { shortcut: 'Ctrl+S' });
        setTimeout(() => setSaveStatus('Saved to LocalStorage'), 2000);
      }

      // Ctrl + Z (Undo)
      else if (isCtrlOrCmd && !e.shiftKey && e.key.toLowerCase() === 'z' && !isInput) {
        e.preventDefault();
        undo();
        trackEvent(AnalyticsEvents.KEYBOARD_SHORTCUT_USED, { shortcut: 'Ctrl+Z' });
      }

      // Ctrl + Shift + Z or Ctrl + Y (Redo)
      else if ((isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'z') || (isCtrlOrCmd && e.key.toLowerCase() === 'y' && !isInput)) {
        e.preventDefault();
        redo();
        trackEvent(AnalyticsEvents.KEYBOARD_SHORTCUT_USED, { shortcut: 'Ctrl+Y' });
      }

      // Ctrl + D (Duplicate resume)
      else if (isCtrlOrCmd && e.key.toLowerCase() === 'd' && !isInput) {
        e.preventDefault();
        duplicateResume(activeResumeId);
        trackEvent(AnalyticsEvents.KEYBOARD_SHORTCUT_USED, { shortcut: 'Ctrl+D' });
      }

      // Ctrl + P (Download PDF trigger)
      else if (isCtrlOrCmd && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        trackEvent(AnalyticsEvents.PDF_DOWNLOAD, { resumeId: activeResumeId, viaShortcut: true });
        window.print();
      }

      // Ctrl + / or ? (Keyboard Help)
      else if ((isCtrlOrCmd && e.key === '/') || (e.key === '?' && !isInput)) {
        e.preventDefault();
        setIsKeyboardHelpOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, duplicateResume, activeResumeId, createVersionSnapshot]);

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        activeResume,
        activeResumeId,
        setActiveResumeId,
        createNewResume,
        duplicateResume,
        deleteResume,
        renameResume,
        updateActiveResume,
        saveStatus,
        lastSavedTimeStr,
        resumeHealth,
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
        setIsAIUpgradePromptOpen
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
