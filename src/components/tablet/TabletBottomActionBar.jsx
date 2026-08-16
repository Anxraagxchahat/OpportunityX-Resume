import React from 'react';
import { ChevronLeft, ChevronRight, Eye, Download, Layout, FileText } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { isPhotoTemplate } from '../../utils/photoDefaults';

export const TabletBottomActionBar = ({
  activeSection,
  onSelectSection,
  viewMode,
  onTogglePreview,
  onOpenExportModal,
  isLandscape = false,
  isSplitView = false,
  onToggleSplitView
}) => {
  const sections = [
    'personal', 'photo', 'summary', 'experience', 'education',
    'projects', 'skills', 'certificates', 'achievements',
    'languages', 'socialLinks', 'customSections'
  ];

  const currentIdx = sections.indexOf(activeSection);

  const handlePrevious = () => {
    if (currentIdx > 0) {
      onSelectSection(sections[currentIdx - 1]);
    }
  };

  const handleNext = () => {
    if (currentIdx < sections.length - 1) {
      onSelectSection(sections[currentIdx + 1]);
    }
  };

  return (
    <footer className="sticky bottom-0 z-30 w-full bg-[var(--ox-surface-primary)] border-t border-[var(--ox-border)] px-3 sm:px-4 md:px-5 py-2.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] flex items-center justify-between gap-2 sm:gap-3 select-none no-print transition-colors duration-300 shrink-0">
      {/* ─── LEFT: Previous Section ─── */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentIdx <= 0}
        className="min-h-[44px] px-3 sm:px-4 py-2 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-xs font-bold text-[var(--ox-text-primary)] hover:border-orange-500/40 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
      >
        <ChevronLeft className="w-4 h-4 text-orange-400" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* ─── CENTER: View Mode / Split View Toggle ─── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePreview}
          className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer active:scale-95 ${
            viewMode === 'preview'
              ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-sm'
              : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] border-[var(--ox-border)] hover:border-orange-500/40'
          }`}
        >
          {viewMode === 'preview' ? (
            <>
              <FileText className="w-4 h-4 text-orange-400" />
              <span>Editor</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-orange-400" />
              <span>Preview</span>
            </>
          )}
        </button>

        {/* Split View toggle on landscape screens (>=860px) */}
        {isLandscape && onToggleSplitView && viewMode !== 'preview' && (
          <button
            type="button"
            onClick={onToggleSplitView}
            className={`min-h-[44px] px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer active:scale-95 ${
              isSplitView
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] border-[var(--ox-border)] hover:text-[var(--ox-text-primary)]'
            }`}
            title="Toggle Split View"
          >
            <Layout className="w-4 h-4" />
            <span className="hidden min-[860px]:inline">
              {isSplitView ? 'Split: ON' : 'Split: OFF'}
            </span>
          </button>
        )}
      </div>

      {/* ─── RIGHT: Save & Next / Download PDF ─── */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleNext}
          disabled={currentIdx >= sections.length - 1}
          className="min-h-[44px] px-3 sm:px-4 py-2 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-xs font-bold text-[var(--ox-text-primary)] hover:border-orange-500/40 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <span className="hidden sm:inline">Save & Next</span>
          <span className="inline sm:hidden">Next</span>
          <ChevronRight className="w-4 h-4 text-orange-400" />
        </button>

        <button
          type="button"
          onClick={onOpenExportModal}
          className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden min-[850px]:inline">PDF Export</span>
        </button>
      </div>
    </footer>
  );
};

export default TabletBottomActionBar;
