import React from 'react';
import { CloudUpload, HardDrive, X, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export default function ResumeMigrationModal({
  isOpen,
  onClose,
  localResumes = [],
  onMigrateToCloud,
  onKeepLocalOnly,
  isMigrating = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg overflow-hidden bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-400">
              <CloudUpload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Resume Found on This Device
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Sync your guest work with your authenticated cloud account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Box */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-2.5">
            <HardDrive className="w-4 h-4" />
            <span>Local Draft Detected</span>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {localResumes.map((res, idx) => (
              <div 
                key={res.metadata?.id || idx}
                className="flex items-center justify-between p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-orange-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-200 truncate text-xs sm:text-sm">
                      {res.metadata?.title || res.personal?.fullName || 'Untitled Resume'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Template: <span className="text-slate-300 capitalize">{res.metadata?.template || 'Modern'}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700 shrink-0">
                  Guest Draft
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Saving this resume to your account enables <strong className="text-slate-300">cross-device access</strong>, cloud backups, and automatic version history.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onMigrateToCloud}
            disabled={isMigrating}
            className="w-full sm:flex-1 py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isMigrating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving to Cloud...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Save to My Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={onKeepLocalOnly}
            disabled={isMigrating}
            className="w-full sm:w-auto py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm rounded-xl transition-all border border-slate-700 cursor-pointer"
          >
            Keep Local Only
          </button>
        </div>
      </div>
    </div>
  );
}
