import React from 'react';
import { X, History, TrendingUp, Calendar } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const ScanHistoryModal = () => {
  const { isScanHistoryOpen, setIsScanHistoryOpen, scanHistory } = useResume();

  if (!isScanHistoryOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 relative">
        <button
          onClick={() => setIsScanHistoryOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Local Scan History Timeline</h3>
            <p className="text-xs text-slate-400">Track resume score improvements over time</p>
          </div>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
          {scanHistory.map((scan) => (
            <div key={scan.id} className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-white">{scan.resumeTitle}</div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {new Date(scan.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-3 font-extrabold">
                <span className="text-emerald-400">ATS: {scan.atsScore}%</span>
                <span className="text-orange-400">Health: {scan.healthScore}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsScanHistoryOpen(false)}
            className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
