import React from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, History, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const AICreditsModal = ({ isOpen, onClose }) => {
  const {
    isAICreditsModalOpen,
    setIsAICreditsModalOpen,
    aiCredits,
    session,
    setIsUnlockAIModalOpen,
    setIsBuyCreditsModalOpen
  } = useResume();

  const active = isOpen !== undefined ? isOpen : isAICreditsModalOpen;
  const handleClose = onClose || (() => setIsAICreditsModalOpen(false));

  if (!active) return null;

  const { remaining = 0, totalPurchased = 0, usageHistory = [] } = aiCredits;
  const totalUsed = usageHistory.reduce((acc, curr) => acc + (curr.creditsUsed || 0), 0);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-orange-500/30 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 relative max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">✨ AI Credits Center</h3>
            <p className="text-xs text-slate-400">
              {session.isAuthenticated && !session.isGuest
                ? `Account: ${session.user?.email}`
                : 'Guest Session — Login to unlock 5 Free Credits'}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#10131D] border border-orange-500/40 text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Remaining</span>
            <div className="text-2xl font-black text-orange-400">{remaining}</div>
            <span className="text-[9px] text-slate-500 block">Never Expire</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Credits Used</span>
            <div className="text-2xl font-black text-white">{totalUsed}</div>
            <span className="text-[9px] text-slate-500 block">AI Requests</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Purchased</span>
            <div className="text-2xl font-black text-emerald-400">{totalPurchased}</div>
            <span className="text-[9px] text-slate-500 block">Credit Packs</span>
          </div>
        </div>

        {/* Core Guarantee */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Core Resume Builder features, templates, and unlimited PDF exports are 100% Free Forever!</span>
        </div>

        {/* Usage History Section */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-500" /> Recent Usage History
            </h4>
            <span className="text-[10px] text-slate-500">{usageHistory.length} logs</span>
          </div>

          {usageHistory.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 bg-[#10131D] rounded-xl border border-slate-800">
              No usage activity logged yet.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
              {usageHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-xl bg-[#10131D] border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                    <span className="text-slate-200 truncate">{item.action}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {item.creditsUsed > 0 && (
                      <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                        -{item.creditsUsed} Cr
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2">
          {session.isAuthenticated && !session.isGuest ? (
            <button
              onClick={() => {
                handleClose();
                setIsBuyCreditsModalOpen(true);
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> Buy Credit Pack (From ₹29)
            </button>
          ) : (
            <button
              onClick={() => {
                handleClose();
                setIsUnlockAIModalOpen(true);
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Login & Claim 5 Free Credits
            </button>
          )}

          <button
            onClick={handleClose}
            className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
