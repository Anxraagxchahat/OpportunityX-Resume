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
    <div className="p-5 rounded-2xl bg-[#0B0D14] border border-orange-500/30 space-y-4 shadow-xl animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
          <span className="font-bold text-white">AI Generation Result</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px]">
            Passed Safety Audit
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>Latency: <strong className="text-white">{latencyMs}</strong></span>
          <span>•</span>
          <span>Credits: <strong className="text-orange-400">{creditsUsed}</strong></span>
          <span>•</span>
          <span>Est. Cost: <strong className="text-emerald-400">{estimatedCost}</strong></span>
        </div>
      </div>

      {/* Side by Side Diff Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Original Input */}
        {originalText && (
          <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-400 flex items-center justify-between">
              <span>Original Content</span>
              <span className="text-[10px] text-slate-500">{originalText.length} chars</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans line-clamp-6">{originalText}</p>
          </div>
        )}

        {/* Improved Output */}
        <div className={`p-3.5 rounded-xl bg-orange-500/5 border border-orange-500/30 space-y-1.5 ${!originalText ? 'sm:col-span-2' : ''}`}>
          <div className="font-bold text-orange-400 flex items-center justify-between">
            <span>AI Improved Output (OpenRouter)</span>
            <button onClick={handleCopy} className="text-slate-400 hover:text-white flex items-center gap-1 font-normal text-[11px]">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-white leading-relaxed font-sans">{improvedText}</p>
        </div>
      </div>

      {/* Interactive Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
        <button
          onClick={onRegenerate}
          className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Regenerate
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onReject}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5 text-red-400" /> Reject
          </button>

          <button
            onClick={onAccept}
            className="px-4 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" /> Accept & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
