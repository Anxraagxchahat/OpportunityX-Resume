import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useMobileNavigation } from '../../context/MobileNavigationContext';

export const MobileToastContainer = () => {
  const { toasts, removeToast } = useMobileNavigation();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 left-4 right-4 z-50 space-y-2 pointer-events-none pb-safe select-none no-print">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-xl border text-xs font-bold transition-all animate-fadeIn ${
              isError
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
                : 'bg-[var(--ox-surface-primary)]/95 border-orange-500/40 text-[var(--ox-text-primary)] backdrop-blur-md'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isError ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : isWarning ? (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default MobileToastContainer;
