import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

export const freeForeverFeatures = [
  'Unlimited Resume Creation',
  'Unlimited Editing',
  'Unlimited Templates',
  'Unlimited PDF Download',
  'Unlimited JSON Export',
  'Unlimited Import',
  'Unlimited Resume Versions',
  'Unlimited Resume Health',
  'Unlimited ATS Analysis',
  'Unlimited Resume Intelligence',
  'No Watermark',
  'No Ads',
  'No Forced Login',
  'Privacy First'
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
    <div className="cyber-glass-card p-5 space-y-4 border-emerald-500/30 relative overflow-hidden bg-gradient-to-br from-[#0B0D14] via-[#0B0D14] to-emerald-950/20">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex-shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-extrabold text-white">OpportunityX Free Forever Policy</h3>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Core Guarantee
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The core resume builder is permanently free and will NEVER be locked behind a paywall.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
        {freeForeverFeatures.map((feat, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span className="leading-tight">{feat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
