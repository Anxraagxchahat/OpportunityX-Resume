import React from 'react';
import { Cpu, DollarSign, Activity, Clock, Zap } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { getAIHistory } from '../services/ai/responseCache';

export const AIUsageDashboard = () => {
  const { aiCredits, selectedAIModel } = useResume();
  const history = getAIHistory();

  const totalCreditsUsed = (aiCredits.usageHistory || []).reduce((acc, h) => acc + (h.creditsUsed || 0), 0);
  const estimatedTotalCost = (totalCreditsUsed * 0.0004).toFixed(4);

  return (
    <div className="cyber-glass-card p-4 sm:p-6 space-y-4 sm:space-y-5 border-orange-500/30 w-full max-w-full min-w-0 box-border">
      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800 w-full min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="p-2 sm:p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 shrink-0">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-extrabold text-white break-words">AI Credits & Usage Dashboard</h3>
            <p className="text-xs text-slate-400 mt-0.5 break-words">Real-time local credit consumption and LLM analytics</p>
          </div>
        </div>

        <span className="text-[10px] sm:text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2.5 sm:px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
          OpenRouter Active
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full min-w-0">
        <div className="p-3 sm:p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1 min-w-0">
          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 flex items-center gap-1 truncate">
            <Zap className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="truncate">Remaining Credits</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white truncate">
            {aiCredits.remaining} <span className="text-xs font-normal text-slate-500">/ {aiCredits.total}</span>
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1 min-w-0">
          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 flex items-center gap-1 truncate">
            <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Consumed Credits</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 truncate">{totalCreditsUsed}</div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1 min-w-0">
          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 flex items-center gap-1 truncate">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Est. Dollar Cost</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 truncate">${estimatedTotalCost}</div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1 min-w-0">
          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 flex items-center gap-1 truncate">
            <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">Active Model</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-blue-400 truncate">{selectedAIModel}</div>
        </div>
      </div>

      {/* History Log */}
      <div className="space-y-2 pt-2 border-t border-slate-800 w-full min-w-0">
        <div className="text-xs font-bold text-slate-300">Recent Local AI Activity</div>
        <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar w-full min-w-0">
          {history.length > 0 ? (
            history.slice(0, 5).map((log) => (
              <div key={log.id} className="p-2 sm:p-2.5 rounded-lg bg-[#10131D] border border-slate-800 flex items-center justify-between gap-2 text-[11px] min-w-0 w-full box-border">
                <div className="truncate text-slate-300 flex-1 min-w-0">{log.contentPreview || log.featureId}</div>
                <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-slate-500 shrink-0 text-[10px] sm:text-[11px]">
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-orange-400 font-bold">-{log.creditsUsed} Cr</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 italic">No AI activity recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIUsageDashboard;

