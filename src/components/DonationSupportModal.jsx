import React from 'react';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const DonationSupportModal = () => {
  const { isDonationModalOpen, setIsDonationModalOpen, activeResume } = useResume();

  if (!isDonationModalOpen) return null;

  const candidateName = activeResume?.personal?.fullName || 'Candidate';

  const handleClose = () => {
    setIsDonationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5 relative">
        {/* Close Icon Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white flex items-center justify-center gap-1.5">
              ✅ Resume Downloaded!
            </h3>
            <p className="text-xs text-emerald-400 font-semibold pt-0.5">
              Saved for {candidateName} (Saved as PDF - A4 Standard)
            </p>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-3">
          <p className="text-slate-300 text-xs leading-relaxed text-center font-medium">
            Your resume has been downloaded successfully.
          </p>

          <div className="pt-2.5 border-t border-slate-800/80 space-y-2">
            <div className="font-bold text-white text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>OpportunityX Resume is completely free:</span>
            </div>
            <ul className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1 pl-1 font-medium">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">•</span> No Watermark
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">•</span> No Mandatory Login
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">•</span> Unlimited Resume Editing
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">•</span> Free PDF Downloads
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Primary */}
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs shadow-lg transition-all active:scale-98"
          >
            Continue Editing Resume
          </button>

          {/* Secondary */}
          <button
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl bg-[#141824] hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

        {/* Future Placeholder */}
        <p className="text-[10px] text-slate-500 text-center pt-1 font-medium">
          Support OpportunityX will be available in a future update.
        </p>
      </div>
    </div>
  );
};
