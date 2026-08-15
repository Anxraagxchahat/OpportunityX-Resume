import React, { useState, useMemo } from 'react';
import { Pencil, Check, Sparkles, ShieldCheck, History, Download, LayoutTemplate } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { calculateResumeHealth } from '../../utils/resumeHealth';

export const TabletDocumentHeader = ({ onOpenVersionHistory, onOpenExportModal }) => {
  const { activeResume, activeResumeId, renameResume } = useResume();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  const health = useMemo(() => calculateResumeHealth(activeResume), [activeResume]);

  const resumeTitle = activeResume?.metadata?.title || 'My Resume';

  const handleStartEditing = () => {
    setTitleInput(resumeTitle);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = (e) => {
    e.preventDefault();
    if (titleInput.trim() && activeResumeId) {
      renameResume(activeResumeId, titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="w-full h-14 bg-[var(--ox-surface-primary)] border-b border-[var(--ox-border)] px-3 sm:px-4 md:px-5 flex items-center justify-between gap-3 text-xs select-none transition-colors duration-300 no-print shrink-0">
      {/* ─── LEFT: Title + Inline Edit + Draft & Health Pills ─── */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {isEditingTitle ? (
          <form onSubmit={handleSaveTitle} className="flex items-center gap-1.5">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              autoFocus
              className="bg-[var(--ox-surface-secondary)] border border-orange-500 rounded-lg px-2.5 py-1 text-xs font-bold text-[var(--ox-text-primary)] focus:outline-none min-w-[160px] sm:min-w-[200px]"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-orange-500 text-black font-bold hover:bg-orange-400 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-1.5 min-w-0 max-w-[220px] sm:max-w-[320px]">
            <h1 className="text-xs sm:text-sm font-extrabold text-[var(--ox-text-primary)] truncate">
              {resumeTitle}
            </h1>
            <button
              onClick={handleStartEditing}
              className="p-1 rounded-md text-[var(--ox-text-secondary)] hover:text-orange-400 hover:bg-orange-500/10 transition-colors cursor-pointer shrink-0"
              title="Edit Resume Title"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active Draft
        </span>

        {/* Health Score Pill */}
        <div className="hidden md:flex items-center gap-1.5 bg-[var(--ox-surface-secondary)] px-2.5 py-1 rounded-xl border border-[var(--ox-border)] shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-[11px] text-[var(--ox-text-secondary)] font-medium">Health</span>
          <span className="text-xs font-black text-[var(--ox-text-primary)]">{health.percentage}%</span>
        </div>
      </div>

      {/* ─── RIGHT: History + Saved Status + Export Center ─── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Autosave status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 text-xs font-semibold px-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Saved</span>
        </div>

        {/* Version History */}
        {onOpenVersionHistory && (
          <button
            type="button"
            onClick={onOpenVersionHistory}
            className="min-h-[44px] px-3 py-1.5 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] hover:border-orange-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title="Version History & Backups"
          >
            <History className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="hidden sm:inline">History</span>
          </button>
        )}

        {/* Export Center Trigger */}
        {onOpenExportModal && (
          <button
            type="button"
            onClick={onOpenExportModal}
            className="min-h-[44px] px-3.5 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95 shrink-0"
            title="Export PDF, DOCX, TXT, JSON"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span className="whitespace-nowrap">Export</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TabletDocumentHeader;
