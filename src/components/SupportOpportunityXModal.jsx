import React, { useEffect } from 'react';
import { X, Heart, Sparkles, Zap } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const SupportOpportunityXModal = () => {
  const {
    isSupportModalOpen,
    setIsSupportModalOpen,
    setIsBuyCreditsModalOpen
  } = useResume();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSupportModalOpen) {
        setIsSupportModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSupportModalOpen, setIsSupportModalOpen]);

  if (!isSupportModalOpen) return null;

  const handleClose = () => {
    setIsSupportModalOpen(false);
  };

  const handleBuyCredits = () => {
    setIsSupportModalOpen(false);
    setIsBuyCreditsModalOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
    >
      <div
        className="bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl p-6 sm:p-7 space-y-5 relative text-[var(--ox-text-primary)] transition-colors duration-300 max-h-[92vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)] p-2 rounded-xl hover:bg-[var(--ox-surface-secondary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          title="Close"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Warm Heart Icon */}
        <div className="flex flex-col items-center text-center space-y-3 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-500/10">
            <Heart className="w-7 h-7 fill-rose-500 stroke-[2.2]" />
          </div>
          <div>
            <h3 id="support-modal-title" className="text-xl font-black text-[var(--ox-text-primary)] tracking-tight flex items-center justify-center gap-1.5">
              ❤️ Support OpportunityX
            </h3>
            <p className="text-xs text-orange-400 font-semibold pt-0.5">
              100% Free Resume Builder
            </p>
          </div>
        </div>

        {/* Informational Message Box */}
        <div className="p-4 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-xs text-[var(--ox-text-secondary)] space-y-3 leading-relaxed">
          <p className="font-medium text-[var(--ox-text-primary)]">
            We're building this for students, while keeping the Resume Builder free for everyone.
          </p>
          <p>
            You don't need to pay to create or download your resume. If you'd genuinely like to support the project, purchasing AI Credits is one simple way to help us keep the platform running and build more useful features.
          </p>
          <div className="pt-2 border-t border-[var(--ox-border)]/70 text-[11px] font-semibold text-orange-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>No pressure. Use it for free, and support only if you find it useful. ❤️</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleBuyCredits}
            className="w-full min-h-[44px] py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-xs shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-black stroke-black" />
            <span>Buy AI Credits</span>
          </button>

          <button
            onClick={handleClose}
            className="w-full min-h-[40px] py-2 rounded-xl bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
          >
            Maybe Later
          </button>
        </div>

        {/* Small Muted Footer Line */}
        <p className="text-[10.5px] text-[var(--ox-text-muted)] text-center pt-0.5 font-medium leading-normal">
          Your support helps us keep OpportunityX free and improve it for everyone.
        </p>
      </div>
    </div>
  );
};

export default SupportOpportunityXModal;
