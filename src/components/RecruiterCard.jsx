import React from 'react';
import { Eye, Clock, Award, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const RecruiterCard = () => {
  const { recruiterScanResult } = useResume();

  if (!recruiterScanResult) return null;

  return (
    <div className="cyber-glass-card p-4 sm:p-6 space-y-4 border-amber-500/30 w-full max-w-full min-w-0 box-border">
      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 w-full min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-extrabold text-white break-words">Recruiter 6-Second Glance Simulator</h3>
            <p className="text-xs text-slate-400 mt-0.5 break-words">Simulated initial recruiter impression</p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
          {recruiterScanResult.firstImpression}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full min-w-0">
        <div className="p-3 rounded-xl bg-[#10131D] border border-slate-800 space-y-1 min-w-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold truncate">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Quick Scan</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate">{recruiterScanResult.quickScanSeconds}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#10131D] border border-slate-800 space-y-1 min-w-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold truncate">
            <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Top Attractive</span>
          </div>
          <div className="text-xs font-bold text-emerald-400 truncate">{recruiterScanResult.mostAttractiveSection}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#10131D] border border-slate-800 space-y-1 min-w-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold truncate">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="truncate">Weakest Section</span>
          </div>
          <div className="text-xs font-bold text-orange-400 truncate">{recruiterScanResult.weakestSection}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#10131D] border border-slate-800 space-y-1 min-w-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">ATS Prediction</span>
          </div>
          <div className="text-xs font-bold text-blue-400 truncate">{recruiterScanResult.atsPrediction}</div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterCard;
