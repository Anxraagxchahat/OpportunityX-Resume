import React from 'react';
import { X, History, TrendingUp, Calendar } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const ScanHistoryModal = () => {
  const { isScanHistoryOpen, setIsScanHistoryOpen, scanHistory } = useResume();

  if (!isScanHistoryOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 relative max-h-[92vh] overflow-y-auto custom-scrollbar box-border min-w-0">
        <button
          onClick={() => setIsScanHistoryOpen(false)}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
          aria-label="Close Scan History Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pr-8 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-extrabold text-white break-words">Local Scan History Timeline</h3>
            <p className="text-xs text-slate-400 mt-0.5 break-words">Track resume score improvements over time</p>
          </div>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1 w-full min-w-0">
          {scanHistory.map((scan) => (
            <div key={scan.id} className="p-3 sm:p-3.5 rounded-xl bg-[#10131D] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs min-w-0 w-full box-border">
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="font-bold text-white break-words">{scan.resumeTitle}</div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 shrink-0" /> {new Date(scan.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2.5 font-extrabold shrink-0">
                <span className="text-emerald-400 text-[11px] sm:text-xs">ATS: {scan.atsScore}%</span>
                <span className="text-orange-400 text-[11px] sm:text-xs">Health: {scan.healthScore}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsScanHistoryOpen(false)}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl cursor-pointer active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanHistoryModal;
