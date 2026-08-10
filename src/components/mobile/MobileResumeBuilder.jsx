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

function MobileResumeBuilderContent() {
  const { activeTab } = useMobileNavigation();

  return (
    <div className="w-full min-h-dvh bg-[var(--ox-bg)] flex flex-col overflow-x-hidden text-[var(--ox-text-primary)] font-sans relative select-none">
      
      {/* Conditionally Render Active Tab Screen */}
      {activeTab === 'home' && <MobileHomeDashboard />}

      {activeTab === 'edit' && (
        <>
          <MobileTopBar />
          <MobileSectionNav />
          <MobileSectionEditor />
        </>
      )}

      {activeTab === 'preview' && <MobileResumePreview />}

      {activeTab === 'templates' && <MobileTemplateGallery />}

      {/* Global Fixed Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Mobile Drawers and Modals */}
      <MobileSectionsDrawer />
      <MobileCardEditorModal />
      <MobileAIConfirmationModal />
      <MobileMoreMenuModal />
      <MobileToastContainer />

    </div>
  );
}

export const MobileResumeBuilder = () => {
  return (
    <MobileErrorBoundary>
      <MobileNavigationProvider>
        <MobileResumeBuilderContent />
      </MobileNavigationProvider>
    </MobileErrorBoundary>
  );
};

export default MobileResumeBuilder;
