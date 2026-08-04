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
    <div className="cyber-glass-card p-6 space-y-5 border-orange-500/30">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">AI Credits & Usage Dashboard</h3>
            <p className="text-xs text-slate-400">Real-time local credit consumption and LLM analytics</p>
          </div>
        </div>

        <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
          OpenRouter Active
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-orange-400" /> Remaining Credits
          </div>
          <div className="text-2xl font-black text-white">{aiCredits.remaining} <span className="text-xs font-normal text-slate-500">/ {aiCredits.total}</span></div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-amber-400" /> Consumed Credits
          </div>
          <div className="text-2xl font-black text-amber-400">{totalCreditsUsed}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Est. Dollar Cost
          </div>
          <div className="text-2xl font-black text-emerald-400">${estimatedTotalCost}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" /> Active Model
          </div>
          <div className="text-xs font-bold text-blue-400 truncate">{selectedAIModel}</div>
        </div>
      </div>

      {/* History Log */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="text-xs font-bold text-slate-300">Recent Local AI Activity</div>
        <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
          {history.length > 0 ? (
            history.slice(0, 5).map((log) => (
              <div key={log.id} className="p-2 rounded-lg bg-[#10131D] border border-slate-800 flex items-center justify-between text-[11px]">
                <div className="truncate text-slate-300 max-w-xs">{log.contentPreview || log.featureId}</div>
                <div className="flex items-center gap-2 font-mono text-slate-500">
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
