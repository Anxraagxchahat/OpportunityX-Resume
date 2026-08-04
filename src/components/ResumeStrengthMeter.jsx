import React from 'react';
import { ShieldCheck, Zap, Activity } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const ResumeStrengthMeter = () => {
  const { resumeStrengthScore, strengthLabel, atsEngineResult, resumeHealth } = useResume();

  const getBadgeStyle = (label) => {
    switch (label) {
      case 'Excellent':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Good':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'Needs Improvement':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-red-500/20 text-red-400 border-red-500/40';
    }
  };

  return (
    <div className="cyber-glass-card p-6 flex flex-col justify-between space-y-4 border-orange-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Overall Resume Strength</h3>
            <p className="text-[11px] text-slate-400">Deterministic multi-factor analysis</p>
          </div>
        </div>

        <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${getBadgeStyle(strengthLabel)}`}>
          {strengthLabel}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-4xl font-black text-white">{resumeStrengthScore}%</span>
          <span className="text-xs text-slate-400 font-semibold">98% Confidence Rating</span>
        </div>

        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 h-full rounded-full transition-all duration-700"
            style={{ width: `${resumeStrengthScore}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-slate-400">
          <span>ATS Pass Rate:</span>
          <strong className="text-emerald-400 font-bold">{atsEngineResult.overallScore}%</strong>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Structure Health:</span>
          <strong className="text-orange-400 font-bold">{resumeHealth.percentage}%</strong>
        </div>
      </div>
    </div>
  );
};
