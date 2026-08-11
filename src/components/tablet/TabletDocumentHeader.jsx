import React, { useState, useMemo } from 'react';
import { Pencil, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { calculateResumeHealth } from '../../utils/resumeHealth';

export const TabletDocumentHeader = () => {
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
    <div className="w-full bg-[var(--ox-surface-primary)] border-b border-[var(--ox-border)] px-4 py-2.5 flex items-center justify-between gap-3 text-xs select-none transition-colors duration-300 no-print">
      {/* LEFT: Title + Edit Icon + Draft Status */}
      <div className="flex items-center gap-3 min-w-0">
        {isEditingTitle ? (
          <form onSubmit={handleSaveTitle} className="flex items-center gap-1.5">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              autoFocus
              className="bg-[#10131D] border border-orange-500/50 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none min-w-[180px]"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-orange-500 text-black font-bold hover:bg-orange-400 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-sm font-extrabold text-[var(--ox-text-primary)] truncate">
              {resumeTitle}
            </h1>
            <button
              onClick={handleStartEditing}
              className="p-1 rounded-md text-[var(--ox-text-secondary)] hover:text-orange-400 hover:bg-orange-500/10 transition-colors cursor-pointer"
              title="Edit Resume Title"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active Draft
        </span>
      </div>

      {/* RIGHT: Health % + Auto-save Status */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Health Score Pill */}
        <div className="flex items-center gap-1.5 bg-[var(--ox-surface-secondary)] px-2.5 py-1 rounded-lg border border-[var(--ox-border)]">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-[11px] text-[var(--ox-text-secondary)] font-medium">Health</span>
          <span className="text-xs font-black text-[var(--ox-text-primary)]">{health.percentage}%</span>
        </div>

        {/* Autosave status indicator */}
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Saved</span>
        </div>
      </div>
    </div>
  );
};

export default TabletDocumentHeader;
