import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Sliders } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const SuggestionsCard = () => {
  const navigate = useNavigate();
  const { validationResult } = useResume();
  const { flaws = [], criticalCount, recommendedCount } = validationResult;

  const handleQuickFix = (sectionId) => {
    navigate('/builder');
  };

  return (
    <div className="cyber-glass-card p-4 sm:p-6 space-y-4 border-orange-500/30 w-full max-w-full min-w-0 box-border">
      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 w-full min-w-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0" />
            <span className="break-words">Actionable Fixes & Suggestions ({flaws.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 break-words">Click Quick Fix to navigate directly to the target section in builder</p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 text-xs shrink-0 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-bold text-[10px] sm:text-xs whitespace-nowrap">
            {criticalCount} Critical
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px] sm:text-xs whitespace-nowrap">
            {recommendedCount} Recommended
          </span>
        </div>
      </div>

      {flaws.length > 0 ? (
        <div className="space-y-3 w-full min-w-0">
          {flaws.map((flaw) => (
            <div
              key={flaw.id}
              className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all min-w-0 w-full box-border ${
                flaw.priority === 'Critical'
                  ? 'bg-red-500/5 border-red-500/30'
                  : flaw.priority === 'Recommended'
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : 'bg-[#10131D] border-slate-800'
              }`}
            >
              <div className="space-y-1 flex-1 min-w-0 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shrink-0 ${
                      flaw.priority === 'Critical'
                        ? 'bg-red-500/20 text-red-300'
                        : flaw.priority === 'Recommended'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {flaw.priority}
                  </span>
                  <span className="text-xs font-bold text-white break-words">{flaw.title}</span>
                </div>
                <p className="text-xs text-slate-400 break-words leading-relaxed">{flaw.desc}</p>
              </div>

              <button
                onClick={() => handleQuickFix(flaw.section)}
                className="w-full sm:w-auto min-h-[38px] justify-center px-3.5 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
              >
                <span>Quick Fix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-5 sm:p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 w-full min-w-0 box-border">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <div className="text-sm font-bold text-emerald-300">Zero Critical Flaws Detected!</div>
          <p className="text-xs text-slate-400">Your resume satisfies all primary validation checks.</p>
        </div>
      )}
    </div>
  );
};

export default SuggestionsCard;
