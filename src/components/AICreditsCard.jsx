import React, { useState } from 'react';
import { Sparkles, Key, History, ChevronDown, ChevronUp, Zap, ShieldCheck } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const AICreditsCard = ({ compact = false }) => {
  const { aiCredits, session, setIsAICreditsModalOpen, setIsBuyCreditsModalOpen, setIsUnlockAIModalOpen, setIsBYOKModalOpen } = useResume();
  const [showHistory, setShowHistory] = useState(false);

  const { remaining = 0, totalPurchased = 0, usageHistory = [] } = aiCredits;
  const isZero = remaining === 0;
  const isLoggedIn = session.isAuthenticated && !session.isGuest;

  if (compact) {
    return (
      <button
        onClick={() => {
          if (!isLoggedIn) setIsUnlockAIModalOpen(true);
          else setIsAICreditsModalOpen(true);
        }}
        className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5 transition-all shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>{isLoggedIn ? `✨ ${remaining} AI Credits` : '✨ Claim 5 Free AI Credits'}</span>
      </button>
    );
  }

  return (
    <div className="cyber-glass-card p-5 space-y-4 border-slate-800 hover:border-orange-500/40 transition-all relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">✨ AI Credits System</h3>
            <p className="text-[11px] text-slate-400">
              {isLoggedIn ? 'Non-expiring Account Credits' : 'Guest Mode — Login to claim 5 free credits'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsBYOKModalOpen(true)}
          className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg flex items-center gap-1 transition-colors"
          title="Bring Your Own API Key"
        >
          <Key className="w-3.5 h-3.5 text-amber-400" /> BYOK Key
        </button>
      </div>

      {/* Main Credit Counter */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-3xl font-black ${isZero ? 'text-red-400' : 'text-orange-400'}`}>
              {remaining}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Remaining AI Credits</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Never Expire</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {isLoggedIn ? (
          <button
            onClick={() => setIsBuyCreditsModalOpen(true)}
            className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" /> Buy Credit Pack (From ₹29)
          </button>
        ) : (
          <button
            onClick={() => setIsUnlockAIModalOpen(true)}
            className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Login & Claim 5 Free Credits
          </button>
        )}

        <button
          onClick={() => setIsAICreditsModalOpen(true)}
          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 rounded-xl transition-colors"
        >
          View Details
        </button>
      </div>

      {/* Policy Reminder */}
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Core resume builder, editing, templates, ATS scores, and PDF exports are <strong className="text-emerald-400 font-semibold">100% Free Forever</strong>. Credits are only required for optional AI generation.
      </p>

      {/* Usage History Collapsible */}
      {usageHistory && usageHistory.length > 0 && (
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-500" /> Recent Usage History
            </span>
            {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showHistory && (
            <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pt-1">
              {usageHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/60 text-slate-300">
                  <span className="truncate max-w-[180px]">{item.action}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

