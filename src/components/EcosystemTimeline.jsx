import React from 'react';
import { Activity, CheckCircle2, ShieldCheck, Share2, Sparkles, RefreshCw } from 'lucide-react';
import { getNotifications } from '../services/ecosystem/notificationCenter';

export const EcosystemTimeline = () => {
  const notifs = getNotifications();

  return (
    <div className="cyber-glass-card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-400" /> Ecosystem Activity Timeline
          </h3>
          <p className="text-xs text-slate-400">Log of ecosystem syncs, views, and verification events</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifs.map((n) => (
          <div key={n.id} className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{n.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-slate-400">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
