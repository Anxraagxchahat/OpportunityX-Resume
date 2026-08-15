import React from 'react';
import { TabletSectionSidebar } from './TabletSectionSidebar';
import { TabletEditor } from './TabletEditor';
import { TabletResumePreview } from './TabletResumePreview';

export const TabletWorkspace = ({
  activeSection,
  onSelectSection,
  viewMode,
  onBackToEdit,
  onOpenExportModal,
  isLandscape = false,
  isSplitView = true,
  viewportWidth = 800
}) => {
  // Show split view when in landscape (or >= 880px) and splitView is enabled, unless user explicitly entered full preview
  const canSplit = (isLandscape || viewportWidth >= 880) && isSplitView;
  const showSplitView = canSplit && viewMode !== 'preview';

  return (
    <div className="flex-1 flex overflow-hidden w-full bg-[var(--ox-bg)] relative transition-colors duration-300">
      {/* ─── LEFT: Section Navigation Sidebar ─── */}
      <TabletSectionSidebar
        activeSection={activeSection}
        onSelectSection={onSelectSection}
      />

      {/* ─── RIGHT: Editor OR Preview OR Split View ─── */}
      <div className="flex-1 flex overflow-hidden relative">
        {viewMode === 'preview' ? (
          <TabletResumePreview
            onBackToEdit={onBackToEdit}
            onOpenExportModal={onOpenExportModal}
            isSplit={false}
          />
        ) : showSplitView ? (
          /* Split View Pane: 45% Editor, 55% Preview */
          <div className="flex-1 flex overflow-hidden w-full">
            {/* Editor Pane (45%) */}
            <div className="w-[45%] border-r border-[var(--ox-border)] overflow-y-auto custom-scrollbar bg-[var(--ox-surface-primary)]">
              <TabletEditor
                activeSection={activeSection}
                isLandscape={true}
              />
            </div>

            {/* Preview Pane (55%) */}
            <div className="w-[55%] overflow-hidden bg-[var(--ox-bg)]">
              <TabletResumePreview
                onBackToEdit={onBackToEdit}
                onOpenExportModal={onOpenExportModal}
                isSplit={true}
              />
            </div>
          </div>
        ) : (
          /* Standard Single Active Editor Pane (Portrait Mode) */
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[var(--ox-surface-primary)]">
            <TabletEditor
              activeSection={activeSection}
              isLandscape={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TabletWorkspace;
