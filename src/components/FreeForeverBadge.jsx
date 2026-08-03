import React from 'react';
import { ShieldCheck, Check, Sparkles, Lock, Zap } from 'lucide-react';

export const freeForeverFeatures = [
  'Unlimited Resume Creation',
  'Unlimited Resume Editing',
  'Unlimited Premium Templates',
  'Unlimited PDF Download',
  'No Watermarks Ever',
  'Client Local Storage Privacy',
  'Resume JSON Import & Export',
  'No Login Required'
];

export const FreeForeverBadge = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>100% Free Forever Core</span>
      </div>
    );
  }

  return (
    <div className="cyber-glass-card p-6 space-y-4 border-emerald-500/30 relative overflow-hidden bg-gradient-to-br from-[#0B0D14] via-[#0B0D14] to-emerald-950/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">OpportunityX Free Forever Policy</h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Core Guarantee
              </span>
            </div>
            <p className="text-xs text-slate-400">
              The core resume builder is permanently free and will NEVER be locked behind a paywall.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
        {freeForeverFeatures.map((feat, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">{feat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
