import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const ResumeRecoveryBanner = () => {
  const { hasRecoveryDraft, restoreRecoveryDraft, discardRecoveryDraft } = useResume();

  if (!hasRecoveryDraft) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-amber-200 sticky top-0 z-40 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 animate-bounce" />
        <span className="font-bold">Resume Recovery Available:</span>
        <span className="hidden sm:inline">An unsaved session from a previous tab crash or refresh was detected.</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={restoreRecoveryDraft}
          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold flex items-center gap-1 shadow-sm transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restore Draft
        </button>
        <button
          onClick={discardRecoveryDraft}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
        >
          Discard
        </button>
      </div>
    </div>
  );
};
