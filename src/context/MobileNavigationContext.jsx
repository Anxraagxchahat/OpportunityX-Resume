import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const MobileNavigationContext = createContext(null);

export const MobileNavigationProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Primary mobile navigation tab
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab');
    if (['home', 'edit', 'preview', 'templates', 'more'].includes(tabParam)) {
      return tabParam;
    }
    return 'edit';
  });

  // Active section inside the editor tab
  const [activeSection, setActiveSection] = useState(() => {
    const sectionParam = searchParams.get('section');
    if (sectionParam) return sectionParam;
    return 'personal';
  });

  // Modal / Drawer UI states
  const [isSectionDrawerOpen, setIsSectionDrawerOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isCardEditorOpen, setIsCardEditorOpen] = useState(false);
  const [cardEditorConfig, setCardEditorConfig] = useState({ section: null, item: null, index: -1 });

  // PWA Install Prompt State & Display Mode Detection
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.navigator.standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = () => checkStandalone();
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = useCallback(async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const choiceResult = await deferredInstallPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setDeferredInstallPrompt(null);
    }
  }, [deferredInstallPrompt]);

  // Drawer / Modal setters with History PushState for Android Back Button support
  const handleSetSectionDrawerOpen = useCallback((open) => {
    setIsSectionDrawerOpen(open);
    if (open && window.history.state?.modal !== 'sectionDrawer') {
      window.history.pushState({ modal: 'sectionDrawer' }, '');
    }
  }, []);

  const handleSetMoreMenuOpen = useCallback((open) => {
    setIsMoreMenuOpen(open);
    if (open && window.history.state?.modal !== 'moreMenu') {
      window.history.pushState({ modal: 'moreMenu' }, '');
    }
  }, []);

  // AI Confirmation modal state
  const [aiModalConfig, setAiModalConfig] = useState({ isOpen: false, type: '', initialPrompt: '', field: '', onApply: null });

  // Toast notifications array
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync tab change with URL & history
  const changeTab = useCallback((tab) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      return next;
    }, { replace: false });
  }, [setSearchParams]);

  // Sync section change with URL & history
  const changeSection = useCallback((sectionId) => {
    setActiveSection(sectionId);
    setActiveTab('edit');
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', 'edit');
      next.set('section', sectionId);
      return next;
    }, { replace: false });
  }, [setSearchParams]);

  // Open item editor bottom sheet (e.g. edit an experience entry)
  const openCardEditor = useCallback((section, item = null, index = -1) => {
    setCardEditorConfig({ section, item, index });
    setIsCardEditorOpen(true);

    if (window.history.state?.modal !== 'cardEditor') {
      window.history.pushState({ modal: 'cardEditor' }, '');
    }
  }, []);

  const closeCardEditor = useCallback(() => {
    setIsCardEditorOpen(false);
    setCardEditorConfig({ section: null, item: null, index: -1 });
  }, []);

  // Android hardware / gesture back button handling
  useEffect(() => {
    const handlePopState = () => {
      if (isCardEditorOpen) {
        setIsCardEditorOpen(false);
        setCardEditorConfig({ section: null, item: null, index: -1 });
      } else if (isSectionDrawerOpen) {
        setIsSectionDrawerOpen(false);
      } else if (isMoreMenuOpen) {
        setIsMoreMenuOpen(false);
      } else if (activeTab !== 'edit') {
        setActiveTab('edit');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isCardEditorOpen, isSectionDrawerOpen, isMoreMenuOpen, activeTab]);

  return (
    <MobileNavigationContext.Provider
      value={{
        activeTab,
        setActiveTab: changeTab,
        activeSection,
        setActiveSection: changeSection,
        isSectionDrawerOpen,
        setIsSectionDrawerOpen: handleSetSectionDrawerOpen,
        isMoreMenuOpen,
        setIsMoreMenuOpen: handleSetMoreMenuOpen,
        isCardEditorOpen,
        cardEditorConfig,
        openCardEditor,
        closeCardEditor,
        aiModalConfig,
        setAiModalConfig,
        toasts,
        addToast,
        removeToast,
        deferredInstallPrompt,
        isInstallable: Boolean(deferredInstallPrompt) && !isStandalone,
        installPWA,
        isStandalone
      }}
    >
      {children}
    </MobileNavigationContext.Provider>
  );
};

export const useMobileNavigation = () => {
  const context = useContext(MobileNavigationContext);
  if (!context) {
    throw new Error('useMobileNavigation must be used within a MobileNavigationProvider');
  }
  return context;
};

export default MobileNavigationContext;
