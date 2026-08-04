import React from 'react';
import { Cpu, Zap, Hash, AlertTriangle } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const KeywordCard = () => {
  const { keywordResult } = useResume();
  const { verbsUsed = [], techFound = [], missingHighImpact = [], densityList = [] } = keywordResult;

  return (
    <div className="cyber-glass-card p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-orange-400" /> Keyword Intelligence & Verbs
          </h3>
          <p className="text-xs text-slate-400">Deterministic keyword extraction and density analysis</p>
        </div>
        <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 rounded-lg">
          {verbsUsed.length} Action Verbs Used
        </span>
      </div>

      {/* Action Verbs Badges */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> High-Impact Action Verbs Found ({verbsUsed.length})
        </div>
        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#10131D] border border-slate-800">
          {verbsUsed.length > 0 ? (
            verbsUsed.map((verb) => (
              <span key={verb} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold capitalize">
                ✓ {verb}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 italic">No strong engineering action verbs detected yet.</span>
          )}
        </div>
      </div>

      {/* Missing High Impact Keywords */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-400" /> Recommended High-Impact Tech Terms ({missingHighImpact.length} Missing)
        </div>
        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#10131D] border border-slate-800">
          {missingHighImpact.map((tech) => (
            <span key={tech} className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/20 text-[11px] font-medium">
              + {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Top Keyword Density */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-emerald-400" /> Top Keyword Frequency & Density
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {densityList.slice(0, 4).map((d) => (
            <div key={d.word} className="p-2.5 rounded-xl bg-[#10131D] border border-slate-800 text-center space-y-0.5">
              <div className="text-xs font-bold text-white capitalize">{d.word}</div>
              <div className="text-[10px] text-slate-400">{d.count} times ({d.densityPct}%)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
