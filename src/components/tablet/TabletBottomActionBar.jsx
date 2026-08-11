import React from 'react';
import { ChevronLeft, ChevronRight, Eye, Download, Layout } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

const SECTIONS = [
  'personal',
  'summary',
  'experience',
  'education',
  'projects',
  'skills',
  'certificates',
  'achievements',
  'languages',
  'socialLinks',
  'customSections'
];

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
  const currentIdx = SECTIONS.indexOf(activeSection);

  const handlePrevious = () => {
    if (currentIdx > 0) {
      onSelectSection(SECTIONS[currentIdx - 1]);
    }
  };

  const handleNext = () => {
    if (currentIdx < SECTIONS.length - 1) {
      onSelectSection(SECTIONS[currentIdx + 1]);
    }
  };

  return (
    <footer className="sticky bottom-0 z-30 w-full bg-[var(--ox-surface-primary)] border-t border-[var(--ox-border)] px-4 py-2.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] flex items-center justify-between gap-3 select-none no-print transition-colors duration-300">
      {/* LEFT: Previous Section */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentIdx <= 0}
        className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-all cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 text-orange-400" />
        <span>Previous</span>
      </button>

      {/* CENTER: View Mode / Split View Toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePreview}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
            viewMode === 'preview'
              ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-sm'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Eye className="w-4 h-4 text-orange-400" />
          <span>{viewMode === 'preview' ? 'Exit Preview' : 'Preview'}</span>
        </button>

        {/* Optional Split View toggle on landscape screens (>=900px) */}
        {isLandscape && onToggleSplitView && (
          <button
            type="button"
            onClick={onToggleSplitView}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isSplitView
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Split Editor & Preview"
          >
            <Layout className="w-4 h-4" />
            <span className="hidden min-[900px]:inline">
              {isSplitView ? 'Focused Editor' : 'Split View'}
            </span>
          </button>
        )}
      </div>

      {/* RIGHT: Save & Next / Download PDF */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleNext}
          disabled={currentIdx >= SECTIONS.length - 1}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>Save & Next</span>
          <ChevronRight className="w-4 h-4 text-orange-400" />
        </button>

        <button
          type="button"
          onClick={onOpenExportModal}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden min-[850px]:inline">PDF Export</span>
        </button>
      </div>
    </footer>
  );
};

export default TabletBottomActionBar;
