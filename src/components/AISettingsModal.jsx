import React, { useState } from 'react';
import { X, Key, Sparkles, Check, AlertCircle, RefreshCw, Eye, EyeOff, ExternalLink, ShieldCheck, Trash2 } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { AI_MODELS, resolveOpenRouterModelId } from '../services/ai/modelRegistry';
import { executeOpenRouterRequest } from '../services/ai/providerManager';

export const AISettingsModal = ({ isOpen, onClose }) => {
  const {
    byokKeys,
    saveByokKeys,
    clearByokKey,
    selectedAIModel,
    setSelectedAIModel,
    isBYOKModalOpen,
    setIsBYOKModalOpen
  } = useResume();

  const showModal = isOpen !== undefined ? isOpen : isBYOKModalOpen;
  const handleClose = onClose || (() => setIsBYOKModalOpen(false));

  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string }
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!showModal) return null;

  const envKey = (import.meta.env.VITE_OPENROUTER_API_KEY || '').trim();
  const customKey = byokKeys?.openrouter?.trim() || '';
  const activeKey = customKey || envKey;
  const isUsingCustomKey = Boolean(customKey && customKey !== envKey);

  const getMaskedKey = (key) => {
    if (!key || key.length < 8) return 'Not Configured';
    return `${key.slice(0, 10)}••••••••••••${key.slice(-4)}`;
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const testTargetKey = inputKey.trim() || activeKey;
    if (!testTargetKey) {
      setTestResult({ success: false, message: 'Please enter an OpenRouter API key to test.' });
      setIsTesting(false);
      return;
    }

    try {
      const res = await executeOpenRouterRequest({
        modelId: selectedAIModel || 'google/gemini-2.5-flash',
        systemPrompt: 'Respond with exactly one word: OK',
        userPrompt: 'Ping test',
        apiKey: testTargetKey,
        maxTokens: 10
      });

      if (res?.generatedContent) {
        setTestResult({
          success: true,
          message: `Connected successfully to OpenRouter (${resolveOpenRouterModelId(selectedAIModel)})!`
        });
      } else {
        setTestResult({ success: false, message: 'Received empty response from OpenRouter.' });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed. Please verify the API key.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveKey = () => {
    if (!inputKey.trim()) return;
    saveByokKeys((prev) => ({ ...prev, openrouter: inputKey.trim() }));
    setInputKey('');
    setSaveSuccess(true);
    setTestResult({ success: true, message: 'Custom API key saved securely in local browser storage.' });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleClearCustomKey = () => {
    clearByokKey('openrouter');
    setInputKey('');
    setTestResult({ success: true, message: 'Custom API key cleared. Reverted to default environment key.' });
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
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[var(--ox-text-primary)]">
                AI Provider & API Key Settings
              </h3>
              <p className="text-xs text-[var(--ox-text-secondary)]">
                Configure OpenRouter integration and model preferences
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

        {/* Current Status Box */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--ox-text-secondary)]">Active Key Status:</span>
            {activeKey ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isUsingCustomKey ? 'Custom BYOK Active' : 'Environment Key Active'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-bold border border-red-500/30 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" />
                Missing API Key
              </span>
            )}
          </div>
          <div className="text-xs font-mono text-[var(--ox-text-primary)] bg-[var(--ox-surface-primary)] p-2.5 rounded-lg border border-[var(--ox-border)] truncate">
            {getMaskedKey(activeKey)}
          </div>
          {isUsingCustomKey && (
            <button
              onClick={handleClearCustomKey}
              className="text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 pt-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Reset to Environment Key
            </button>
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
          <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Preferred AI Model</label>
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
            Active OpenRouter slug: <code className="font-mono text-orange-400">{resolveOpenRouterModelId(selectedAIModel)}</code>
          </p>
        </div>

        {/* Custom BYOK Key Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[var(--ox-text-secondary)]">
              Custom OpenRouter API Key (Optional BYOK)
            </label>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-orange-400 hover:text-orange-300 inline-flex items-center gap-1"
            >
              Get API Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="sk-or-v1-..."
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
            Your key is never sent to our servers; it is stored securely in your local browser sandbox.
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
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Testing Connection...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Test Connection
              </>
            )}
          </button>

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
        </div>
      </div>
    </div>
  );
};

export default AISettingsModal;
