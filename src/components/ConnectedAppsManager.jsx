import React, { useState } from 'react';
import { Layers, RefreshCw, Check, Globe } from 'lucide-react';
import { getAllProducts } from '../services/ecosystem/ecosystemRegistry';
import { triggerManualEcosystemSync } from '../services/ecosystem/ecosystemSyncManager';

export const ConnectedAppsManager = () => {
  const products = getAllProducts();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncState, setSyncState] = useState('Synced');

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      triggerManualEcosystemSync();
      setIsSyncing(false);
      setSyncState('Synced');
    }, 600);
  };

  return (
    <div className="cyber-glass-card p-6 space-y-4 border-orange-500/30">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-400" /> Connected OpportunityX Apps ({products.length})
          </h3>
          <p className="text-xs text-slate-400">Single source of truth profile across subdomains</p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="px-3.5 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          <span>{isSyncing ? 'Syncing...' : 'Sync Ecosystem'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {products.map((p) => (
          <div key={p.id} className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{p.name}</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {p.connectionState}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono text-slate-500">{p.subdomain}</span>
              <span className="text-slate-500 font-semibold">{p.lastSync}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
