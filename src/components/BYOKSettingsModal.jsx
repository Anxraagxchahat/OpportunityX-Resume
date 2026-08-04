import React, { useState } from 'react';
import { X, Key, ShieldCheck, Eye, EyeOff, Save, Check } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const BYOKSettingsModal = () => {
  const { isBYOKModalOpen, setIsBYOKModalOpen, byokKeys, saveByokKeys } = useResume();
  const [keysForm, setKeysForm] = useState(byokKeys);
  const [showMask, setShowMask] = useState({ openai: false, gemini: false, openrouter: false, anthropic: false });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isBYOKModalOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveByokKeys(keysForm);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsBYOKModalOpen(false);
    }, 1200);
  };

  const toggleMask = (provider) => {
    setShowMask((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 relative">
        <button
          onClick={() => setIsBYOKModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Bring Your Own API Key (BYOK)</h3>
            <p className="text-xs text-slate-400">Store optional LLM provider keys locally in browser</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
            <span>Keys are stored purely in your local browser LocalStorage and never sent to OpportunityX servers.</span>
          </div>

          <div className="space-y-3">
            {/* OpenAI Key */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">OpenAI API Key (sk-...)</label>
              <div className="relative">
                <input
                  type={showMask.openai ? "text" : "password"}
                  value={keysForm.openai || ''}
                  onChange={(e) => setKeysForm({ ...keysForm, openai: e.target.value })}
                  placeholder="sk-proj-..."
                  className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 pr-10 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => toggleMask('openai')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showMask.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Google Gemini Key */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Google Gemini API Key</label>
              <div className="relative">
                <input
                  type={showMask.gemini ? "text" : "password"}
                  value={keysForm.gemini || ''}
                  onChange={(e) => setKeysForm({ ...keysForm, gemini: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 pr-10 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => toggleMask('gemini')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showMask.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* OpenRouter Key */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">OpenRouter API Key</label>
              <div className="relative">
                <input
                  type={showMask.openrouter ? "text" : "password"}
                  value={keysForm.openrouter || ''}
                  onChange={(e) => setKeysForm({ ...keysForm, openrouter: e.target.value })}
                  placeholder="sk-or-v1-..."
                  className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 pr-10 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => toggleMask('openrouter')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showMask.openrouter ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Anthropic Claude Key */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Anthropic Claude API Key</label>
              <div className="relative">
                <input
                  type={showMask.anthropic ? "text" : "password"}
                  value={keysForm.anthropic || ''}
                  onChange={(e) => setKeysForm({ ...keysForm, anthropic: e.target.value })}
                  placeholder="sk-ant-..."
                  className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 pr-10 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => toggleMask('anthropic')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showMask.anthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsBYOKModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Keys Saved!' : 'Save Keys'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
