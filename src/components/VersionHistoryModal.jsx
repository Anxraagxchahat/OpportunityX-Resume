import React, { useState } from 'react';
import { History, X, RotateCcw, Copy, Check, Clock, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const VersionHistoryModal = ({ isOpen, onClose, versions, onRestore, onCreateSnapshot }) => {
  const [restoredId, setRestoredId] = useState(null);

  if (!isOpen) return null;

  const handleRestore = (id) => {
    onRestore(id);
    setRestoredId(id);
    setTimeout(() => {
      setRestoredId(null);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md no-print">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-xl bg-[#0B0D14] border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Version History</h3>
                <p className="text-xs text-slate-400">Restore or manage previous resume snapshots</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Trigger */}
          <div className="my-4 flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-300 font-medium">Save current state as a new version</span>
            <button
              onClick={() => onCreateSnapshot()}
              className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> Save Snapshot
            </button>
          </div>

          {/* Version List */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {versions.map((ver, index) => (
              <div
                key={ver.id}
                className="p-4 rounded-xl bg-[#10131D] border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {ver.title || `Version ${ver.versionNumber}`}
                    </span>
                    {index === 0 && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Active Draft
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(ver.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRestore(ver.id)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    {restoredId === ver.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Restored
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 text-orange-400" /> Restore
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>OpportunityX Version Engine</span>
            <span>Cloud sync ready (Phase 1)</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
