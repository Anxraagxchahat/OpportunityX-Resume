import React from 'react';
import { Cpu, Zap, Hash, AlertTriangle } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const KeywordCard = () => {
  const { keywordResult } = useResume();
  const { verbsUsed = [], techFound = [], missingHighImpact = [], densityList = [] } = keywordResult;

  return (
    <div className="cyber-glass-card p-4 sm:p-6 space-y-5 w-full max-w-full min-w-0 box-border">
      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 w-full min-w-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0" />
            <span className="break-words">Keyword Intelligence & Verbs</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 break-words">Deterministic keyword extraction and density analysis</p>
        </div>
        <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 rounded-lg shrink-0 whitespace-nowrap">
          {verbsUsed.length} Action Verbs Used
        </span>
      </div>

      {/* Action Verbs Badges */}
      <div className="space-y-2 w-full min-w-0">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 flex-wrap">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>High-Impact Action Verbs Found ({verbsUsed.length})</span>
        </div>
        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#10131D] border border-slate-800 w-full min-w-0 box-border">
          {verbsUsed.length > 0 ? (
            verbsUsed.map((verb) => (
              <span key={verb} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold capitalize max-w-full break-words">
                ✓ {verb}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 italic">No strong engineering action verbs detected yet.</span>
          )}
        </div>
      </div>

      {/* Missing High Impact Keywords */}
      <div className="space-y-2 w-full min-w-0">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 flex-wrap">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span>Recommended High-Impact Tech Terms ({missingHighImpact.length} Missing)</span>
        </div>
        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#10131D] border border-slate-800 w-full min-w-0 box-border">
          {missingHighImpact.map((tech) => (
            <span key={tech} className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/20 text-[11px] font-medium max-w-full break-words">
              + {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Top Keyword Density */}
      <div className="space-y-2 w-full min-w-0">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 flex-wrap">
          <Hash className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Top Keyword Frequency & Density</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full min-w-0">
          {densityList.slice(0, 4).map((d) => (
            <div key={d.word} className="p-2.5 rounded-xl bg-[#10131D] border border-slate-800 text-center space-y-0.5 min-w-0">
              <div className="text-xs font-bold text-white capitalize truncate">{d.word}</div>
              <div className="text-[10px] text-slate-400 whitespace-nowrap">{d.count} times ({d.densityPct}%)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeywordCard;
