import React, { useState } from 'react';
import { Sparkles, X, Check, RefreshCw, Wand2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIFloatingAssistModal = ({ isOpen, onClose, targetField, initialText, onApply }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const [generatedOptions, setGeneratedOptions] = useState([]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let suggestions = [];
      if (targetField === 'summary') {
        suggestions = [
          `High-performing ${initialText ? 'Software Engineer' : 'Professional'} with expertise in building scalable SaaS platforms, optimizing cloud services, and delivering user-centric products. Proven track record of boosting system efficiency by 40% while reducing latency.`,
          `Results-driven Developer skilled in full-stack architecture, high-throughput microservices, and modern web frameworks. Passionate about engineering accessible, high-speed applications with 99.99% reliability.`,
          `Innovative Full-Stack Engineer specializing in React, TypeScript, and cloud-native backends. Experienced in leading agile teams, streamlining CI/CD pipelines, and integrating AI workflows into consumer applications.`
        ];
      } else if (targetField === 'experience' || targetField === 'bullet') {
        suggestions = [
          `Engineered high-concurrency microservices processing 10M+ daily events, reducing API response times by 42%.`,
          `Architected scalable React/Tailwind user interfaces, elevating Lighthouse performance scores to 98+.`,
          `Optimized SQL database query indexing, cutting server execution latency from 450ms down to 85ms.`
        ];
      } else if (targetField === 'project') {
        suggestions = [
          `Designed and deployed an open-source analytics dashboard utilizing React, Vite, and Tailwind CSS to track live metrics across 100K+ users.`,
          `Engineered a real-time collaborative workspace platform with WebSocket synchronization and instant cloud backups.`
        ];
      } else if (targetField === 'skills') {
        suggestions = [
          `TypeScript, React, Next.js, Node.js, Tailwind CSS, PostgreSQL, Docker, AWS, GraphQL, Redis`
        ];
      } else {
        suggestions = [
          `Enhanced text alignment with action verbs and quantifiable metrics for maximum ATS keyword compliance.`,
          `Streamlined description to emphasize technical leadership, system architecture, and product impact.`
        ];
      }
      setGeneratedOptions(suggestions);
      setSelectedOption(0);
      setIsGenerating(false);
    }, 600);
  };

  // Trigger initial generate if options are empty
  if (generatedOptions.length === 0 && !isGenerating) {
    handleGenerate();
  }

  const handleApply = () => {
    if (generatedOptions[selectedOption]) {
      onApply(generatedOptions[selectedOption]);
      onClose();
    }
  };

  const handleCopy = () => {
    if (generatedOptions[selectedOption]) {
      navigator.clipboard.writeText(generatedOptions[selectedOption]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl bg-[#0B0D14] border border-orange-500/30 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(249,115,22,0.15)] relative overflow-hidden"
        >
          {/* Top Decorative Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  OpportunityX AI Assistant
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Phase 0 Preview
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  AI-powered professional optimization for {targetField || 'section'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="space-y-4">
            {isGenerating ? (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-orange-400 animate-spin mx-auto" />
                <p className="text-sm font-medium text-slate-300">
                  OpportunityX AI is generating high-impact enhancements...
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Generated Options ({generatedOptions.length})</span>
                    <button
                      onClick={handleGenerate}
                      className="text-orange-400 hover:text-orange-300 flex items-center gap-1 hover:underline"
                    >
                      <Wand2 className="w-3.5 h-3.5" /> Regenerate
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {generatedOptions.map((option, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedOption(idx)}
                        className={`p-3.5 rounded-xl border text-sm transition-all cursor-pointer ${
                          selectedOption === idx
                            ? 'bg-orange-500/10 border-orange-500/60 text-white shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                            : 'bg-[#10131D] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="leading-relaxed">{option}</p>
                          <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            selectedOption === idx ? 'border-orange-500 bg-orange-500 text-black' : 'border-slate-600'
                          }`}>
                            {selectedOption === idx && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={isGenerating || generatedOptions.length === 0}
                className="px-4 py-2 text-xs font-semibold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Apply to Resume
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
