import React, { useState } from 'react';
import { TabletTopBar } from './TabletTopBar';
import { TabletDocumentHeader } from './TabletDocumentHeader';
import { TabletWorkspace } from './TabletWorkspace';
import { TabletBottomActionBar } from './TabletBottomActionBar';
import { ExportCenterModal } from '../ExportCenterModal';
import { VersionHistoryModal } from '../VersionHistoryModal';
import { KeyboardShortcutsModal } from '../KeyboardShortcutsModal';
import { ResumeRecoveryBanner } from '../ResumeRecoveryBanner';
import { useDeviceType } from '../../hooks/useDeviceType';

export const TabletAppShell = () => {
  const { orientation, width } = useDeviceType();
  const isLandscape = orientation === 'landscape';

  const [activeSection, setActiveSection] = useState('personal');
  const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'preview'
  const [isSplitView, setIsSplitView] = useState(false);

  const [isExportCenterOpen, setIsExportCenterOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

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
      <TabletDocumentHeader />

      {/* 3. TABLET WORKSPACE (Two-Pane) */}
      <TabletWorkspace
        activeSection={activeSection}
        onSelectSection={(secId) => setActiveSection(secId)}
        viewMode={viewMode}
        onBackToEdit={() => setViewMode('editor')}
        onOpenExportModal={() => setIsExportCenterOpen(true)}
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
    </div>
  );
};

export default TabletAppShell;
