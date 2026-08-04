import React from 'react';
import { Eye, Clock, Award, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const RecruiterCard = () => {
  const { recruiterScanResult } = useResume();

  if (!recruiterScanResult) return null;

  return (
    <div className="cyber-glass-card p-6 space-y-4 border-amber-500/30">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Recruiter 6-Second Glance Simulator</h3>
            <p className="text-xs text-slate-400">Simulated initial recruiter impression</p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
          {recruiterScanResult.firstImpression}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Quick Scan Time
          </div>
          <div className="text-sm font-bold text-white">{recruiterScanResult.quickScanSeconds}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
            <Award className="w-3.5 h-3.5 text-emerald-400" /> Top Attractive
          </div>
          <div className="text-xs font-bold text-emerald-400 truncate">{recruiterScanResult.mostAttractiveSection}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" /> Weakest Section
          </div>
          <div className="text-xs font-bold text-orange-400 truncate">{recruiterScanResult.weakestSection}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> ATS Prediction
          </div>
          <div className="text-xs font-bold text-blue-400 truncate">{recruiterScanResult.atsPrediction}</div>
        </div>
      </div>
    </div>
  );
};
