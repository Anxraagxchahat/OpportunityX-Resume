import React, { useState } from 'react';
import { X, Sparkles, Check, AlertCircle, RefreshCw, Eye, EyeOff, ExternalLink, ShieldCheck, Trash2, Sliders, Coins, Key } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { AI_MODELS, resolveOpenRouterModelId } from '../services/ai/modelRegistry';
import { apiService } from '../services/api';

export const AISettingsModal = ({ isOpen, onClose }) => {
  const {
    byokKeys,
    saveByokKeys,
    clearByokKey,
    selectedAIModel,
    setSelectedAIModel,
    isBYOKModalOpen,
    setIsBYOKModalOpen,
    aiCredits,
    refreshCreditBalance,
    session,
    setIsBuyCreditsModalOpen
  } = useResume();

  const showModal = isOpen !== undefined ? isOpen : isBYOKModalOpen;
  const handleClose = onClose || (() => setIsBYOKModalOpen(false));

  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!showModal) return null;

  const customKey = byokKeys?.openrouter?.trim() || '';
  const isUsingCustomKey = Boolean(customKey && customKey.length > 10);
  const { remaining = 0, totalUsed = 0, totalPurchased = 0 } = aiCredits;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const testTargetKey = inputKey.trim() || (isUsingCustomKey ? customKey : undefined);

    try {
      const res = await apiService.generateAI({
        feature: 'summary',
        prompt: 'Return a 1-sentence test ping confirmation for OpportunityX AI.',
        content: { rawText: 'Software Engineer test ping' },
        model: selectedAIModel || 'google/gemini-2.5-flash',
        byokKey: testTargetKey || undefined
      });

      if (res?.result) {
        setTestResult({
          success: true,
          message: `Connection Verified: Successfully reached AI Engine (${resolveOpenRouterModelId(selectedAIModel)})!`
        });
      } else {
        setTestResult({ success: false, message: 'Received empty response from AI engine.' });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed. Please check your credentials.'
      });
    } finally {
      setIsTesting(false);
      refreshCreditBalance().catch(() => {});
    }
  };

  const handleSaveKey = () => {
    if (!inputKey.trim()) return;
    saveByokKeys((prev) => ({ ...prev, openrouter: inputKey.trim() }));
    setInputKey('');
    setSaveSuccess(true);
    setTestResult({ success: true, message: 'Custom BYOK key saved securely in your browser session.' });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleClearCustomKey = () => {
    clearByokKey('openrouter');
    setInputKey('');
    setTestResult({ success: true, message: 'Reverted to standard OpportunityX AI Copilot.' });
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-2xl w-full max-w-lg shadow-2xl p-5 sm:p-6 space-y-5 relative text-[var(--ox-text-primary)] transition-colors duration-300 max-h-[92vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[var(--ox-text-primary)]">
                AI Generation & Key Settings
              </h3>
              <p className="text-xs text-[var(--ox-text-secondary)]">
                Manage AI execution mode, models, and personal API keys
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)] p-1.5 rounded-xl hover:bg-[var(--ox-surface-secondary)] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Execution Mode Card */}
        <div className="p-4 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--ox-text-secondary)]">Active Execution Mode:</span>
            {isUsingCustomKey ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30 text-xs">
                <Key className="w-3.5 h-3.5" />
                BYOK Mode (Personal Key)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                OpportunityX AI (Credits)
              </span>
            )}
          </div>

          {/* Real-time Credits Accounting Summary */}
          {!isUsingCustomKey && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-lg bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] flex items-center justify-between">
                <span className="text-xs text-[var(--ox-text-secondary)]">Available Credits</span>
                <span className="text-sm font-black text-orange-400 font-mono">{remaining}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] flex items-center justify-between">
                <span className="text-xs text-[var(--ox-text-secondary)]">Total Used</span>
                <span className="text-sm font-black text-emerald-400 font-mono">{totalUsed}</span>
              </div>
            </div>
          )}

          {isUsingCustomKey && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[var(--ox-text-muted)] font-mono">
                Key: {customKey.slice(0, 8)}...{customKey.slice(-4)}
              </span>
              <button
                onClick={handleClearCustomKey}
                className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Reset to Credits
              </button>
            </div>
          )}
        </div>

        {/* Test Result / Error Alert */}
        {testResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {testResult.success ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className="leading-snug">{testResult.message}</span>
          </div>
        )}

        {/* Model Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Preferred AI Model Engine</label>
          <select
            value={selectedAIModel}
            onChange={(e) => setSelectedAIModel(e.target.value)}
            className="w-full min-h-[42px] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] rounded-xl px-3 text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            {Object.values(AI_MODELS).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-[var(--ox-text-muted)]">
            OpenRouter model ID: <code className="font-mono text-orange-400">{resolveOpenRouterModelId(selectedAIModel)}</code>
          </p>
        </div>

        {/* Optional Custom BYOK Key Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[var(--ox-text-secondary)]">
              Bring Your Own Key (Optional BYOK)
            </label>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-orange-400 hover:text-orange-300 inline-flex items-center gap-1"
            >
              Get OpenRouter Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Paste custom key (e.g. sk-or-v1-...)"
              className="w-full min-h-[42px] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl px-3 pr-10 text-xs font-mono text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
            />
            <button
              type="button"
              onClick={() => setShowKey((prev) => !prev)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)] p-1"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-[var(--ox-text-muted)]">
            Providing your own OpenRouter key allows unlimited personal generations with 0 OpportunityX platform credit deduction.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex-1 min-h-[42px] px-4 rounded-xl bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Testing Pipeline...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Test Connection
              </>
            )}
          </button>

          {inputKey.trim() && (
            <button
              type="button"
              onClick={handleSaveKey}
              disabled={!inputKey.trim() || isTesting}
              className="flex-1 min-h-[42px] px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" /> Saved!
                </>
              ) : (
                <>Save Custom Key</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISettingsModal;
