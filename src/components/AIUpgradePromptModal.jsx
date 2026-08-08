import React from 'react';
import { X, Sparkles, ShieldCheck, Zap, ArrowRight, Key } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const AIUpgradePromptModal = () => {
  const { isAIUpgradePromptOpen, setIsAIUpgradePromptOpen, setIsBuyCreditsModalOpen, setIsBYOKModalOpen } = useResume();

  if (!isAIUpgradePromptOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-orange-500/40 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5 relative">
        <button
          onClick={() => setIsAIUpgradePromptOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 w-fit">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black text-white">Need More AI Credits?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            You've used your current AI credits. Top up anytime with flexible credit packs. Credits <strong>never expire</strong>!
          </p>
        </div>

        {/* Core Reassurance */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Resume Builder Remains 100% Free</span>
          </div>
          <p className="text-[11px] text-emerald-300/80">
            Resume editing, templates, ATS scores, and unlimited PDF downloads are NEVER locked. Only optional AI features require credits.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              setIsAIUpgradePromptOpen(false);
              setIsBuyCreditsModalOpen(true);
            }}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs flex items-center justify-between shadow-lg transition-all"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" /> Buy Credit Pack (From ₹29)
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAIUpgradePromptOpen(false)}
            className="w-full p-2 text-center text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Continue Editing Resume Manually
          </button>
        </div>
      </div>
    </div>
  );
};

