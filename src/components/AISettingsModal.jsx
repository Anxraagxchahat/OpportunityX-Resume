import React, { useState } from 'react';
import { X, Cpu, Key, Sliders, ShieldCheck, Download, Upload, Check, Activity } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { useAIInfrastructure } from '../hooks/useAIInfrastructure';
import { maskApiKey } from '../services/ai/security';

export const AISettingsModal = () => {
  const { isBYOKModalOpen, setIsBYOKModalOpen, byokKeys, saveByokKeys } = useResume();
  const { providers, models, providerHealthList } = useAIInfrastructure();

  const [selectedProvider, setSelectedProvider] = useState('gemini');
  const [selectedModel, setSelectedModel] = useState('gemini-flash');
  const [streaming, setStreaming] = useState(true);
  const [temperature, setTemperature] = useState(0.7);

  const [keyInputs, setKeyInputs] = useState(byokKeys);

  if (!isBYOKModalOpen) return null;

  const handleSaveKeys = (e) => {
    e.preventDefault();
    saveByokKeys(keyInputs);
    setIsBYOKModalOpen(false);
  };

  const handleExportConfig = () => {
    const config = { provider: selectedProvider, model: selectedModel, streaming, temperature };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", `opportunityx_ai_config.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-5 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={() => setIsBYOKModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">AI Provider Infrastructure & BYOK Settings</h3>
            <p className="text-xs text-slate-400">Configure LLM providers, model registries, and local API keys</p>
          </div>
        </div>

        {/* AI Provider Health Badges */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-orange-400" /> AI Provider Availability Health
          </div>
          <div className="grid grid-cols-2 gap-2">
            {providerHealthList.map((h) => (
              <div key={h.providerId} className="p-2.5 rounded-xl bg-[#10131D] border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-white capitalize">{h.providerId}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${h.color}`}>
                  {h.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Provider & Model Selectors */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Active Provider</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              {Object.values(providers).map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Active LLM Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              {Object.values(models).map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Temperature & Streaming Controls */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Temperature</span>
              <span className="text-orange-400">{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#10131D] border border-slate-800">
            <span className="text-xs font-bold text-slate-300">Enable Streaming</span>
            <input
              type="checkbox"
              checked={streaming}
              onChange={(e) => setStreaming(e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
          </div>
        </div>

        {/* Local BYOK API Keys Form */}
        <form onSubmit={handleSaveKeys} className="space-y-3 pt-2 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" /> Bring Your Own Key (BYOK - 100% Local Storage)
          </div>

          <div className="space-y-2">
            {Object.keys(providers).map((pId) => (
              <div key={pId} className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span className="capitalize">{pId} API Key</span>
                  <span>{maskApiKey(keyInputs[pId])}</span>
                </div>
                <input
                  type="password"
                  value={keyInputs[pId] || ''}
                  onChange={(e) => setKeyInputs({ ...keyInputs, [pId]: e.target.value })}
                  placeholder={`Enter your ${pId} key (e.g. sk-...)`}
                  className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleExportConfig}
              className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export Settings JSON
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center gap-1"
            >
              <Check className="w-4 h-4" /> Save AI Infrastructure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
