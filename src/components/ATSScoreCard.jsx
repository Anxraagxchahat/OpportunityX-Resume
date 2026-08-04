import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const ATSScoreCard = () => {
  const { atsEngineResult } = useResume();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="cyber-glass-card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> ATS Compatibility Audit (10 Categories)
          </h3>
          <p className="text-xs text-slate-400">Detailed rule-based evaluation with full transparency</p>
        </div>
        <span className="text-lg font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
          {atsEngineResult.overallScore} / 100
        </span>
      </div>

      <div className="space-y-2.5">
        {atsEngineResult.categories.map((cat) => {
          const isExpanded = expandedId === cat.id;
          return (
            <div
              key={cat.id}
              className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(cat.id)}>
                <div className="flex items-center gap-2.5">
                  {cat.status === 'Pass' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : cat.status === 'Warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  )}
                  <span className="text-xs font-bold text-white">{cat.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-slate-300">
                    {cat.score} / {cat.weight} pts
                  </span>
                  <button className="text-slate-500 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Explanation Panel */}
              {isExpanded && (
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2 text-xs text-slate-300 pt-2 animate-fadeIn">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Analysis Reason & Evidence:</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{cat.explanation}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px]">
                    <span className="font-bold text-orange-400">Recommended Fix: </span>
                    <span className="text-slate-300">{cat.suggestion}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
