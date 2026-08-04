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
    <div className="cyber-glass-card p-6 space-y-4 border-orange-500/30">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-400" /> Actionable Fixes & Suggestions ({flaws.length})
          </h3>
          <p className="text-xs text-slate-400">Click Quick Fix to navigate directly to the target section in builder</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
            {criticalCount} Critical
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
            {recommendedCount} Recommended
          </span>
        </div>
      </div>

      {flaws.length > 0 ? (
        <div className="space-y-3">
          {flaws.map((flaw) => (
            <div
              key={flaw.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                flaw.priority === 'Critical'
                  ? 'bg-red-500/5 border-red-500/30'
                  : flaw.priority === 'Recommended'
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : 'bg-[#10131D] border-slate-800'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      flaw.priority === 'Critical'
                        ? 'bg-red-500/20 text-red-300'
                        : flaw.priority === 'Recommended'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {flaw.priority}
                  </span>
                  <span className="text-xs font-bold text-white">{flaw.title}</span>
                </div>
                <p className="text-xs text-slate-400">{flaw.desc}</p>
              </div>

              <button
                onClick={() => handleQuickFix(flaw.section)}
                className="px-3.5 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap"
              >
                <span>Quick Fix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <div className="text-sm font-bold text-emerald-300">Zero Critical Flaws Detected!</div>
          <p className="text-xs text-slate-400">Your resume satisfies all primary validation checks.</p>
        </div>
      )}
    </div>
  );
};
