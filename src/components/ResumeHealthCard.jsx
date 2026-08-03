import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { calculateResumeHealth } from '../utils/resumeHealth';

export const ResumeHealthCard = ({ resumeData, onFixSection, compact = false }) => {
  const health = calculateResumeHealth(resumeData);
  const { percentage, completedCount, totalCount, missingSections, healthStatus, badgeColor } = health;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badgeColor}`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Health: {percentage}%</span>
        </div>
        <span className="text-[11px] text-slate-400">
          ({completedCount}/{totalCount} sections)
        </span>
      </div>
    );
  }

  return (
    <div className="cyber-glass-card p-5 space-y-4 border-slate-800 hover:border-orange-500/40 transition-all">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Resume Health</h3>
            <p className="text-[11px] text-slate-400">Client-Side Structural Audit</p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${badgeColor}`}>
          {healthStatus}
        </div>
      </div>

      {/* Main Score Bar */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">{percentage}%</span>
            <span className="text-xs text-slate-400 font-semibold">Complete</span>
          </div>
          <span className="text-xs font-semibold text-slate-300">
            {completedCount} / {totalCount} Sections
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 transition-all duration-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Completed vs Missing Sections Breakdown */}
      {missingSections.length > 0 ? (
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Recommended Additions ({missingSections.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingSections.map((sec) => (
              <button
                key={sec}
                onClick={() => onFixSection && onFixSection(sec.toLowerCase())}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 flex items-center gap-1 transition-colors group"
              >
                <span>+ {sec}</span>
                {onFixSection && <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>All 10 Core Resume Sections Completed!</span>
        </div>
      )}
    </div>
  );
};
