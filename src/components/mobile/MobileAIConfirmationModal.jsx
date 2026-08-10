import React, { useState } from 'react';
import { Sparkles, X, Check, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useMobileNavigation } from '../../context/MobileNavigationContext';

export const MobileAIConfirmationModal = () => {
  const { aiCredits, checkAIAccess } = useResume();
  const { aiModalConfig, setAiModalConfig, addToast } = useMobileNavigation();

  const [stage, setStage] = useState('confirm'); // 'confirm' | 'loading' | 'preview' | 'error'
  const [generatedResult, setGeneratedResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!aiModalConfig.isOpen) return null;

  const handleClose = () => {
    setAiModalConfig({ isOpen: false, type: '', initialPrompt: '', field: '', onApply: null });
    setStage('confirm');
    setGeneratedResult('');
    setErrorMessage('');
  };

  const handleExecuteAI = async () => {
    // Check credits before executing
    if (!checkAIAccess || !checkAIAccess(1)) {
      addToast('Insufficient AI Credits', 'error');
      handleClose();
      return;
    }

    setStage('loading');

    try {
      if (typeof aiModalConfig.onGenerate === 'function') {
        const result = await aiModalConfig.onGenerate();
        if (result) {
          setGeneratedResult(result);
          setStage('preview');
        } else {
          setErrorMessage('AI server returned empty suggestion.');
          setStage('error');
        }
      } else {
        // Fallback simulation if no custom generator passed
        setTimeout(() => {
          setGeneratedResult('Results-oriented software engineer with expertise in scalable web architectures...');
          setStage('preview');
        }, 1200);
      }
    } catch (err) {
      setErrorMessage(err.message || 'AI service request failed.');
      setStage('error');
    }
  };

  const handleApply = () => {
    if (typeof aiModalConfig.onApply === 'function') {
      aiModalConfig.onApply(generatedResult);
      addToast('AI Suggestion Applied', 'success');
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/85 backdrop-blur-md animate-fadeIn no-print select-none">
      <div className="bg-[var(--ox-surface-primary)] border-t border-[var(--ox-border)] rounded-t-3xl w-full p-5 space-y-4 shadow-2xl pb-safe">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--ox-border)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--ox-text-primary)]">
                {aiModalConfig.title || 'Improve with AI'}
              </h3>
              <p className="text-xs text-[var(--ox-text-secondary)]">OpportunityX AI Copilot</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage 1: Confirm Credit Requirement */}
        {stage === 'confirm' && (
          <div className="space-y-4 py-2">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-orange-400">
                <span>Credit Notice</span>
                <span>Requires 1 AI Credit</span>
              </div>
              <p className="text-[var(--ox-text-secondary)] text-[11px]">
                Your wallet has <strong className="text-[var(--ox-text-primary)]">{aiCredits.remaining} credits</strong> available. No credits will be deducted if the operation fails.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleClose}
                className="px-4 py-3 rounded-2xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] font-bold text-xs min-h-[48px]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAI}
                className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold text-xs flex items-center gap-2 min-h-[48px] shadow-lg active:scale-95 transition-transform"
              >
                <Sparkles className="w-4 h-4" />
                <span>Continue & Enhance</span>
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Loading */}
        {stage === 'loading' && (
          <div className="py-8 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
            <p className="text-sm font-bold text-[var(--ox-text-primary)]">Generating AI Suggestion...</p>
            <p className="text-xs text-[var(--ox-text-secondary)]">Analyzing role & industry keywords</p>
          </div>
        )}

        {/* Stage 3: Preview Suggestion */}
        {stage === 'preview' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--ox-text-secondary)]">AI Suggestion</label>
              <div className="p-4 rounded-2xl bg-[var(--ox-card-bg)] border border-orange-500/40 text-xs leading-relaxed text-[var(--ox-text-primary)] max-h-48 overflow-y-auto custom-scrollbar">
                {generatedResult}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleClose}
                className="px-4 py-3 rounded-2xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] font-bold text-xs min-h-[48px]"
              >
                Keep Original
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 min-h-[48px] shadow-lg active:scale-95 transition-transform"
              >
                <Check className="w-4 h-4" />
                <span>Apply Suggestion</span>
              </button>
            </div>
          </div>
        )}

        {/* Stage 4: Error State */}
        {stage === 'error' && (
          <div className="py-4 space-y-4">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorMessage || 'Unable to complete AI operation.'}</span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-3 rounded-2xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] font-bold text-xs min-h-[48px]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAI}
                className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold text-xs flex items-center gap-2 min-h-[48px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MobileAIConfirmationModal;
