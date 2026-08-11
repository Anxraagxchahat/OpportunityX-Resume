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
  isSplitView = false,
  viewportWidth = 800
}) => {
  // Can split view be shown? Requires width >= 900px AND landscape AND isSplitView requested
  const showSplitView = isLandscape && viewportWidth >= 900 && isSplitView && viewMode !== 'preview';

  return (
    <div className="flex-1 flex overflow-hidden w-full bg-[var(--ox-bg)] relative">
      {/* LEFT: Section Navigation Sidebar */}
      <TabletSectionSidebar
        activeSection={activeSection}
        onSelectSection={onSelectSection}
      />

      {/* RIGHT: Editor OR Preview OR Split View */}
      <div className="flex-1 flex overflow-hidden relative">
        {viewMode === 'preview' ? (
          <TabletResumePreview
            onBackToEdit={onBackToEdit}
            onOpenExportModal={onOpenExportModal}
          />
        ) : showSplitView ? (
          /* Split View Pane */
          <div className="flex-1 flex overflow-hidden">
            {/* Editor Pane (50%) */}
            <div className="w-1/2 border-r border-[var(--ox-border)] overflow-y-auto">
              <TabletEditor
                activeSection={activeSection}
                isLandscape={true}
              />
            </div>

            {/* Preview Pane (50%) */}
            <div className="w-1/2 overflow-hidden bg-[#080B12]">
              <TabletResumePreview
                onBackToEdit={onBackToEdit}
                onOpenExportModal={onOpenExportModal}
              />
            </div>
          </div>
        ) : (
          /* Standard Single Active Editor Pane */
          <TabletEditor
            activeSection={activeSection}
            isLandscape={isLandscape}
          />
        )}
      </div>
    </div>
  );
};

export default TabletWorkspace;
