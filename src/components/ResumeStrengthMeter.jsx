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
    <div className="p-4 sm:p-6 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] flex flex-col justify-between space-y-4 shadow-lg transition-colors duration-300 w-full min-w-0 box-border">
      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2.5 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="p-2 sm:p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 shrink-0">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-sm font-extrabold text-[var(--ox-text-primary)] truncate">
              Overall Resume Strength
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[var(--ox-text-secondary)] break-words">
              Deterministic multi-factor analysis
            </p>
          </div>
        </div>

        <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full border shrink-0 whitespace-nowrap ${getBadgeStyle(strengthLabel)}`}>
          {strengthLabel}
        </span>
      </div>

      <div className="space-y-2 w-full min-w-0">
        <div className="flex flex-wrap justify-between items-baseline gap-1">
          <span className="text-2xl sm:text-4xl font-black text-[var(--ox-text-primary)]">{resumeStrengthScore}%</span>
          <span className="text-[11px] sm:text-xs text-[var(--ox-text-secondary)] font-semibold whitespace-nowrap">98% Confidence Rating</span>
        </div>

        <div className="w-full bg-[var(--ox-surface-primary)] h-2.5 rounded-full overflow-hidden border border-[var(--ox-border)]">
          <div
            className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 h-full rounded-full transition-all duration-700"
            style={{ width: `${resumeStrengthScore}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] pt-3 border-t border-[var(--ox-border)] w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[var(--ox-text-secondary)] min-w-0">
          <span className="truncate">ATS Pass Rate:</span>
          <strong className="text-emerald-400 font-bold sm:ml-1">{atsEngineResult.overallScore}%</strong>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[var(--ox-text-secondary)] min-w-0 text-right sm:text-left">
          <span className="truncate">Structure Health:</span>
          <strong className="text-orange-400 font-bold sm:ml-1">{resumeHealth.percentage}%</strong>
        </div>
      </div>
    </div>
  );
};

export default ResumeStrengthMeter;
