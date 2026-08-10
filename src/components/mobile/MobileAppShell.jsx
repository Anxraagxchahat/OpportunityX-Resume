import React from 'react';
import { useMobileNavigation, MobileNavigationProvider } from '../../context/MobileNavigationContext';
import { MobileTopBar } from './MobileTopBar';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileSectionNav } from './MobileSectionNav';
import { MobileSectionEditor } from './MobileSectionEditor';
import { MobileResumePreview } from './MobileResumePreview';
import { MobileTemplateGallery } from './MobileTemplateGallery';
import { MobileHomeDashboard } from './MobileHomeDashboard';
import { MobileSectionsDrawer } from './MobileSectionsDrawer';
import { MobileCardEditorModal } from './MobileCardEditorModal';
import { MobileAIConfirmationModal } from './MobileAIConfirmationModal';
import { MobileMoreMenuModal } from './MobileMoreMenuModal';
import { MobileToastContainer } from './MobileToastContainer';
import { MobileErrorBoundary } from './MobileErrorBoundary';

function MobileAppShellContent() {
  const { activeTab } = useMobileNavigation();

  return (
    <div className="w-full min-h-dvh bg-[var(--ox-bg)] flex flex-col overflow-x-hidden text-[var(--ox-text-primary)] font-sans relative select-none">
      
      {/* 1. TOP NAVIGATION / HEADER LAYER */}
      {activeTab === 'edit' && (
        <>
          <MobileTopBar />
          <MobileSectionNav />
        </>
      )}

      {activeTab === 'home' && <MobileTopBar />}

      {/* 2. MUTUALLY EXCLUSIVE ACTIVE VIEW CONTENT */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'edit' && <MobileSectionEditor />}
        {activeTab === 'preview' && <MobileResumePreview />}
        {activeTab === 'templates' && <MobileTemplateGallery />}
        {activeTab === 'home' && <MobileHomeDashboard />}
      </main>

      {/* 3. FIXED BOTTOM NAVIGATION BAR */}
      <MobileBottomNav />

      {/* 4. GLOBAL DRAWERS & MODALS */}
      <MobileSectionsDrawer />
      <MobileCardEditorModal />
      <MobileAIConfirmationModal />
      <MobileMoreMenuModal />
      <MobileToastContainer />

    </div>
  );
}

export const MobileAppShell = () => {
  return (
    <MobileErrorBoundary>
      <MobileNavigationProvider>
        <MobileAppShellContent />
      </MobileNavigationProvider>
    </MobileErrorBoundary>
  );
};

export default MobileAppShell;
