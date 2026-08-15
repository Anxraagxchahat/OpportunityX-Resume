import React, { useState } from 'react';
import { TabletTopBar } from './TabletTopBar';
import { TabletDocumentHeader } from './TabletDocumentHeader';
import { TabletWorkspace } from './TabletWorkspace';
import { TabletBottomActionBar } from './TabletBottomActionBar';
import { ExportCenterModal } from '../ExportCenterModal';
import { VersionHistoryModal } from '../VersionHistoryModal';
import { PhotoCropModal } from '../PhotoCropModal';
import { ResumeRecoveryBanner } from '../ResumeRecoveryBanner';
import { useDeviceType } from '../../hooks/useDeviceType';
import { useResume } from '../../context/ResumeContext';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';

export const TabletAppShell = () => {
  const { orientation, width } = useDeviceType();
  const isLandscape = orientation === 'landscape';
  const { activeResume } = useResume();

  const [activeSection, setActiveSection] = useState('personal');
  const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'preview'
  const [isSplitView, setIsSplitView] = useState(true); // Split view on by default for tablet landscape

  const [isExportCenterOpen, setIsExportCenterOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isPhotoCropOpen, setIsPhotoCropOpen] = useState(false);

  const handleTogglePreview = () => {
    setViewMode((prev) => (prev === 'editor' ? 'preview' : 'editor'));
  };

  const handleToggleSplitView = () => {
    setIsSplitView((prev) => !prev);
  };

  return (
    <div className="w-full h-dvh min-h-dvh bg-[var(--ox-bg)] flex flex-col overflow-hidden text-[var(--ox-text-primary)] font-sans relative select-none">
      {/* Recovery Banner if autosave restored */}
      <ResumeRecoveryBanner />

      {/* 1. TABLET TOP BAR */}
      <TabletTopBar />

      {/* 2. TABLET DOCUMENT HEADER */}
      <TabletDocumentHeader
        onOpenVersionHistory={() => setIsVersionHistoryOpen(true)}
        onOpenExportModal={() => setIsExportCenterOpen(true)}
      />

      {/* 3. TABLET WORKSPACE (Two-Pane) */}
      <TabletWorkspace
        activeSection={activeSection}
        onSelectSection={(secId) => setActiveSection(secId)}
        viewMode={viewMode}
        onBackToEdit={() => setViewMode('editor')}
        onOpenExportModal={() => setIsExportCenterOpen(true)}
        onOpenPhotoCrop={() => setIsPhotoCropOpen(true)}
        isLandscape={isLandscape}
        isSplitView={isSplitView}
        viewportWidth={width}
      />

      {/* 4. TABLET BOTTOM ACTION BAR */}
      <TabletBottomActionBar
        activeSection={activeSection}
        onSelectSection={(secId) => setActiveSection(secId)}
        viewMode={viewMode}
        onTogglePreview={handleTogglePreview}
        onOpenExportModal={() => setIsExportCenterOpen(true)}
        isLandscape={isLandscape}
        isSplitView={isSplitView}
        onToggleSplitView={handleToggleSplitView}
      />

      {/* Modals */}
      <ExportCenterModal
        isOpen={isExportCenterOpen}
        onClose={() => setIsExportCenterOpen(false)}
      />

      {isVersionHistoryOpen && (
        <VersionHistoryModal
          isOpen={isVersionHistoryOpen}
          onClose={() => setIsVersionHistoryOpen(false)}
        />
      )}

      {isPhotoCropOpen && (
        <PhotoCropModal
          isOpen={isPhotoCropOpen}
          onClose={() => setIsPhotoCropOpen(false)}
          photoSrc={activeResume?.assets?.profilePhoto || DEFAULT_PROFILE_PHOTO}
        />
      )}
    </div>
  );
};

export default TabletAppShell;
