import React, { useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const DownloadSuccessModal = () => {
  const {
    isDownloadSuccessModalOpen,
    setIsDownloadSuccessModalOpen,
    setIsSupportModalOpen,
    activeResume
  } = useResume();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDownloadSuccessModalOpen) {
        setIsDownloadSuccessModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDownloadSuccessModalOpen, setIsDownloadSuccessModalOpen]);

  if (!isDownloadSuccessModalOpen) return null;

  const candidateName = activeResume?.personal?.fullName || 'Candidate';

  const handleClose = () => {
    setIsDownloadSuccessModalOpen(false);
  };

  const handleOpenSupport = () => {
    setIsDownloadSuccessModalOpen(false);
    setIsSupportModalOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
    >
      <div
        className="bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl p-5 sm:p-6 space-y-4 relative text-[var(--ox-text-primary)] transition-colors duration-300 max-h-[92vh] overflow-y-auto custom-scrollbar"
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

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 id="download-modal-title" className="text-lg sm:text-xl font-black text-[var(--ox-text-primary)] flex items-center justify-center gap-1.5">
              Resume Downloaded!
            </h3>
            <p className="text-xs text-emerald-400 font-semibold pt-0.5">
              Saved for {candidateName} (PDF — A4 Standard)
            </p>
          </div>
        </div>

        {/* Content Box 1: Free Guarantee */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-xs text-[var(--ox-text-secondary)] space-y-2.5">
          <div className="font-bold text-[var(--ox-text-primary)] text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>OpportunityX Resume guarantees:</span>
          </div>
          <ul className="grid grid-cols-2 gap-2 text-[11px] text-[var(--ox-text-secondary)] pl-1 font-medium">
            <li className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">•</span> No Watermark
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">•</span> No Mandatory Login
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">•</span> Unlimited Edits
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">•</span> Free PDF Downloads
            </li>
          </ul>
        </div>

        {/* Content Box 2: Subtle Support Section */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-xs text-[var(--ox-text-secondary)] space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-bold text-[var(--ox-text-primary)] text-xs flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 shrink-0" />
              <span>Enjoying OpportunityX Resume?</span>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-[var(--ox-text-secondary)]">
            The Resume Builder is completely free — no mandatory login, no watermark, and free PDF downloads.
          </p>
          <p className="text-[11px] leading-relaxed text-[var(--ox-text-secondary)]">
            If you'd like to support us, you can purchase AI Credits and help us keep building and improving OpportunityX. 🚀
          </p>
          <div className="pt-1 flex justify-start">
            <button
              type="button"
              onClick={handleOpenSupport}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors py-1 cursor-pointer group"
            >
              <span>Support OpportunityX</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleClose}
            className="w-full min-h-[44px] py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black text-xs shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center"
          >
            Continue Editing Resume
          </button>

          <button
            onClick={handleClose}
            className="w-full min-h-[40px] py-2 rounded-xl bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadSuccessModal;
