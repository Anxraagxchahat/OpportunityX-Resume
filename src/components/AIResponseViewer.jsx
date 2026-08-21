import React, { useState } from 'react';
import { Check, X, Copy, RefreshCw, Sparkles, Clock, DollarSign, ArrowRight } from 'lucide-react';

export const AIResponseViewer = ({
  originalText = '',
  improvedText = '',
  creditsUsed = 1,
  estimatedCost = '$0.0004',
  latencyMs = '320ms',
  onAccept = () => {},
  onReject = () => {},
  onRegenerate = () => {}
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (improvedText) {
      navigator.clipboard.writeText(improvedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (!improvedText) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0D14] border border-orange-500/30 space-y-4 shadow-xl animate-fadeIn w-full min-w-0 box-border">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800 text-xs w-full min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <Sparkles className="w-4 h-4 text-orange-400 animate-pulse shrink-0" />
          <span className="font-bold text-white">AI Generation Result</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] shrink-0 whitespace-nowrap">
            Passed Safety Audit
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-400 font-mono text-[10px] sm:text-[11px] min-w-0">
          <span>Latency: <strong className="text-white">{latencyMs}</strong></span>
          <span className="hidden sm:inline">•</span>
          <span>Credits: <strong className="text-orange-400">{creditsUsed}</strong></span>
          <span className="hidden sm:inline">•</span>
          <span>Est. Cost: <strong className="text-emerald-400">{estimatedCost}</strong></span>
        </div>
      </div>

      {/* Side by Side Diff Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs w-full min-w-0">
        {/* Original Input */}
        {originalText && (
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1.5 min-w-0 w-full box-border">
            <div className="font-bold text-slate-400 flex items-center justify-between gap-2">
              <span className="truncate">Original Content</span>
              <span className="text-[10px] text-slate-500 shrink-0">{originalText.length} chars</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans line-clamp-6 break-words">{originalText}</p>
          </div>
        )}

        {/* Improved Output */}
        <div className={`p-3 sm:p-3.5 rounded-xl bg-orange-500/5 border border-orange-500/30 space-y-1.5 min-w-0 w-full box-border ${!originalText ? 'sm:col-span-2' : ''}`}>
          <div className="font-bold text-orange-400 flex items-center justify-between gap-2">
            <span className="truncate">AI Improved Output (OpenRouter)</span>
            <button onClick={handleCopy} className="text-slate-400 hover:text-white flex items-center gap-1 font-normal text-[11px] shrink-0 cursor-pointer">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-white leading-relaxed font-sans break-words">{improvedText}</p>
        </div>
      </div>

      {/* Interactive Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-800 w-full min-w-0">
        <button
          onClick={onRegenerate}
          className="min-h-[40px] px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Regenerate</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onReject}
            className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>Reject</span>
          </button>

          <button
            onClick={onAccept}
            className="flex-1 sm:flex-initial min-h-[40px] px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
            <span>Accept & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIResponseViewer;

