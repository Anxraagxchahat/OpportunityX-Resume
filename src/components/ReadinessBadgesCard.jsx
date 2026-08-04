import React from 'react';
import { Award, CheckCircle2, XCircle } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { evaluateReadinessLevels } from '../utils/readinessLevels';

export const ReadinessBadgesCard = () => {
  const { activeResume, atsEngineResult, resumeHealth } = useResume();
  const badges = evaluateReadinessLevels(activeResume, atsEngineResult.overallScore, resumeHealth.percentage);

  return (
    <div className="cyber-glass-card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Career Readiness Levels
          </h3>
          <p className="text-xs text-slate-400">Deterministic readiness evaluation across application tiers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-3.5 rounded-xl border space-y-1.5 transition-all ${
              badge.achieved ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#10131D] border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {badge.achieved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
                <span className="text-xs font-bold text-white">{badge.title}</span>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${badge.achieved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                {badge.achieved ? 'Achieved' : 'Locked'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{badge.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
