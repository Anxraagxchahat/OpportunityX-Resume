import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wand2,
  Sparkles,
  RefreshCw,
  Check,
  Copy,
  ArrowRight,
  Bot,
  FileText,
  Cpu,
  Lock,
  Activity,
  Sliders,
  DollarSign,
  Key,
  Layers,
  AlertCircle
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { useAIInfrastructure } from '../hooks/useAIInfrastructure';
import { executeOpenRouterRequest } from '../services/ai/providerManager';
import { buildMinimalContext } from '../services/ai/contextBuilder';
import { getPromptTemplate } from '../services/ai/promptLibrary';
import { getCachedResponse, setCachedResponse } from '../services/ai/responseCache';
import { AISettingsModal } from '../components/AISettingsModal';
import { AIResponseViewer } from '../components/AIResponseViewer';
import { AIUsageDashboard } from '../components/AIUsageDashboard';

export const AIAssistantPage = () => {
  const navigate = useNavigate();
  const { activeResume, updatePersonal, setIsBYOKModalOpen, selectedAIModel, setSelectedAIModel, aiCredits, consumeCredit, checkAIAccess, session, setIsUnlockAIModalOpen, byokKeys } = useResume();

  const { features, models, providerHealthList, estimateCost } = useAIInfrastructure();

  const [selectedFeatureId, setSelectedFeatureId] = useState('summary_generator');
  const [promptInput, setPromptInput] = useState('Senior Full Stack Engineer with expertise in React, Node.js, and cloud architecture...');
  const [tone, setTone] = useState('Professional');

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const activeFeature = features[selectedFeatureId.toUpperCase()] || Object.values(features)[0];
  const costEstimate = estimateCost(promptInput, selectedAIModel, activeFeature.requiredCredits);
  const isGuest = !session.isAuthenticated || session.isGuest;

  const handleRunOpenRouterRequest = async () => {
    setErrorMsg(null);

    // 1. Gate check for Authentication & Credits
    if (!checkAIAccess(activeFeature.name)) {
      return;
    }

    // 2. Check response cache
    const cached = getCachedResponse(selectedFeatureId, promptInput, selectedAIModel);
    if (cached) {
      setExecutionResult(cached);
      return;
    }

    setIsExecuting(true);

    try {
      // 3. Build minimal context
      const contextPayload = buildMinimalContext(selectedFeatureId, activeResume, { textToFix: promptInput });

      // 4. Build prompt using template
      const template = getPromptTemplate(selectedFeatureId);
      const systemPrompt = template.systemPrompt;
      const userPrompt = template.userPromptTemplate(promptInput || JSON.stringify(contextPayload));

      // 5. Execute OpenRouter HTTP request (with 1-time retry)
      const apiKey = byokKeys.openrouter || import.meta.env.VITE_OPENROUTER_API_KEY;
      const result = await executeOpenRouterRequest({
        modelId: selectedAIModel || 'google/gemini-2.5-flash:free',
        systemPrompt,
        userPrompt: `${userPrompt}\nDesired Tone: ${tone}. Respond with content only.`,
        apiKey
      });

      // 6. Deduct credit ONLY on successful response
      consumeCredit(activeFeature.name);

      // 7. Cache response locally
      setCachedResponse(selectedFeatureId, promptInput, selectedAIModel, result);

      setExecutionResult(result);
    } catch (err) {
      console.error("AI Generation Failed:", err);
      setErrorMsg(err.message || "Failed to generate AI content. No credit was deducted.");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleApplyToResume = () => {
    if (executionResult?.generatedContent) {
      updatePersonal('summary', executionResult.generatedContent);
      navigate('/builder');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/30">
          <Wand2 className="w-3.5 h-3.5 animate-pulse" /> Powered by AI • Uses AI Credits
        </div>
        <h1 className="text-3xl font-black text-white">AI Resume Assistant Suite</h1>
        <p className="text-sm text-slate-400">
          Smart AI generation for summary, experience, reviews, cover letters, and LinkedIn summaries.
        </p>
      </div>

      {/* Guest Locked Banner */}
      {isGuest && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-[var(--ox-surface-secondary)] border border-orange-500/40 text-center space-y-4 shadow-xl transition-colors duration-300">
          <div className="p-3 rounded-full bg-orange-500/20 text-orange-500 w-fit mx-auto border border-orange-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[var(--ox-text-primary)]">AI Suite is Locked for Guests</h2>
            <p className="text-xs text-[var(--ox-text-secondary)] font-medium max-w-md mx-auto">
              Login to claim your <strong className="text-orange-500 font-bold">5 FREE Welcome AI Credits</strong> and unlock all 9 AI capabilities. Core Resume Builder remains 100% Free Forever without login!
            </p>
          </div>
          <button
            onClick={() => setIsUnlockAIModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Unlock AI Features (Claim 5 Free Credits)
          </button>
        </div>
      )}



      {/* Usage Dashboard */}
      <AIUsageDashboard />

      {/* Feature Registry Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-400" /> Choose AI Capability ({Object.keys(features).length} Features)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.values(features).map((feat) => {
            const isSel = selectedFeatureId === feat.id;
            return (
              <div
                key={feat.id}
                onClick={() => setSelectedFeatureId(feat.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSel
                    ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                    : 'bg-[#10131D] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{feat.name}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">
                    {feat.requiredCredits} Credit{feat.requiredCredits > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Test Bench */}
      <div className="cyber-glass-card p-6 space-y-6 max-w-4xl mx-auto border-orange-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" /> OpenRouter AI Execution Suite
            </h3>
            <p className="text-xs text-slate-400">Configure parameters and execute real LLM generation</p>
          </div>

          <select
            value={selectedAIModel}
            onChange={(e) => setSelectedAIModel(e.target.value)}
            className="bg-[#080B12] border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          >
            {Object.values(models).map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Cost Estimator Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#080B12] border border-slate-800 text-xs">
          <div><span className="text-slate-400">Est. Tokens:</span> <strong className="text-white block font-mono">{costEstimate.totalTokens}</strong></div>
          <div><span className="text-slate-400">Est. Cost:</span> <strong className="text-emerald-400 block font-mono">${costEstimate.totalDollarCost}</strong></div>
          <div><span className="text-slate-400">Required Credits:</span> <strong className="text-orange-400 block font-mono">{activeFeature.requiredCredits} Credit</strong></div>
          <div><span className="text-slate-400">Status:</span> <strong className="text-amber-400 block font-mono">OpenRouter Ready</strong></div>
        </div>

        {/* Tone Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Tone & Output Style</label>
          <div className="grid grid-cols-4 gap-2">
            {['Professional', 'Friendly', 'Corporate', 'Technical'].map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  tone === t ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' : 'bg-[#10131D] text-slate-400 border-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Input Prompt / Existing Context</label>
          <textarea
            rows={3}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="w-full bg-[#080B12] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Execution Button */}
        <button
          onClick={handleRunOpenRouterRequest}
          disabled={isExecuting}
          className="px-5 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-[0_0_18px_rgba(249,115,22,0.3)] transition-all flex items-center gap-2"
        >
          {isExecuting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Executing OpenRouter Request...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" /> Run OpenRouter AI Generation ({activeFeature.requiredCredits} Credit)
            </>
          )}
        </button>

        {/* Interactive Response Viewer */}
        {executionResult && (
          <AIResponseViewer
            originalText={promptInput}
            improvedText={executionResult.generatedContent}
            creditsUsed={executionResult.creditsConsumed}
            latencyMs={executionResult.latencyMs}
            onAccept={handleApplyToResume}
            onReject={() => setExecutionResult(null)}
            onRegenerate={handleRunOpenRouterRequest}
          />
        )}
      </div>

      <AISettingsModal />
    </div>
  );
};
