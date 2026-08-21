import React from 'react';
import { Award, CheckCircle2, XCircle } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { evaluateReadinessLevels } from '../utils/readinessLevels';

export const ReadinessBadgesCard = () => {
  const { activeResume, atsEngineResult, resumeHealth } = useResume();
  const badges = evaluateReadinessLevels(activeResume, atsEngineResult.overallScore, resumeHealth.percentage);

  return (
    <div className="cyber-glass-card p-4 sm:p-6 space-y-4 w-full max-w-full min-w-0 box-border">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 w-full min-w-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <span className="break-words">Career Readiness Levels</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 break-words">Deterministic readiness evaluation across application tiers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-3 sm:p-3.5 rounded-xl border space-y-1.5 transition-all min-w-0 w-full box-border ${
              badge.achieved ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#10131D] border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {badge.achieved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span className="text-xs font-bold text-white truncate">{badge.title}</span>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded shrink-0 whitespace-nowrap ${badge.achieved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                {badge.achieved ? 'Achieved' : 'Locked'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed break-words">{badge.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadinessBadgesCard;
