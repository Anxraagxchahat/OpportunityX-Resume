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
  const {
    activeResume,
    updatePersonal,
    setIsBYOKModalOpen,
    selectedAIModel,
    setSelectedAIModel,
    aiCredits,
    consumeCredit,
    checkAIAccess,
    session,
    setIsUnlockAIModalOpen,
    byokKeys,
    executeAIGeneration
  } = useResume();

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
  const isKeyActive = Boolean(byokKeys?.openrouter?.trim() || session.isAuthenticated);

  const handleRunOpenRouterRequest = async () => {
    setErrorMsg(null);

    // 1. Gate check for Authentication & Credits
    if (!checkAIAccess(activeFeature.name)) {
      return;
    }

    setIsExecuting(true);

    try {
      // 2. Build minimal context
      const contextPayload = buildMinimalContext(selectedFeatureId, activeResume, {
        textToFix: promptInput,
        selectedItem: promptInput
      });

      // 3. Execute via Authoritative Server-Side AI Pipeline
      const response = await executeAIGeneration({
        feature: selectedFeatureId,
        prompt: promptInput || undefined,
        content: contextPayload,
        model: selectedAIModel,
        targetRole: activeResume?.personal?.jobTitle || activeResume?.personal?.targetRole
      });

      if (response && response.result) {
        const textResult = typeof response.result === 'string' ? response.result : JSON.stringify(response.result, null, 2);
        const resultObj = {
          generatedContent: textResult,
          modelUsed: response.model_used || selectedAIModel,
          qualityReport: { isPassed: true, wordCount: textResult.split(/\s+/).filter(Boolean).length },
          estimatedCostUSD: costEstimate.totalDollarCost || 0.0001
        };

        // Cache response locally
        setCachedResponse(selectedFeatureId, promptInput, selectedAIModel, resultObj);
        setExecutionResult(resultObj);
      }
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
    <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8 transition-colors duration-300 min-w-0 box-border">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto min-w-0">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[11px] sm:text-xs font-bold border border-orange-500/30 max-w-full">
          <Wand2 className="w-3.5 h-3.5 animate-pulse shrink-0" />
          <span className="truncate">Powered by AI • Uses AI Credits</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-[var(--ox-text-primary)] break-words leading-tight">
          AI Resume Assistant Suite
        </h1>
        <p className="text-xs sm:text-sm text-[var(--ox-text-secondary)] break-words leading-relaxed">
          Smart AI generation for summary, experience, reviews, cover letters, and LinkedIn summaries.
        </p>
      </div>

      {/* Guest Locked Banner */}
      {isGuest && (
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-[var(--ox-surface-secondary)] border border-orange-500/40 text-center space-y-3.5 sm:space-y-4 shadow-xl transition-colors duration-300 w-full min-w-0 box-border">
          <div className="p-2.5 sm:p-3 rounded-full bg-orange-500/20 text-orange-500 w-fit mx-auto border border-orange-500/30">
            <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="space-y-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-extrabold text-[var(--ox-text-primary)] break-words">
              AI Suite is Locked for Guests
            </h2>
            <p className="text-xs text-[var(--ox-text-secondary)] font-medium max-w-md mx-auto break-words leading-relaxed">
              Login to claim your <strong className="text-orange-500 font-bold">5 FREE Welcome AI Credits</strong> and unlock all 9 AI capabilities. Core Resume Builder remains 100% Free Forever without login!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsUnlockAIModalOpen(true)}
            className="w-full sm:w-auto min-h-[44px] px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="truncate">Unlock AI Features (Claim 5 Free Credits)</span>
          </button>
        </div>
      )}

      {/* Usage Dashboard */}
      <AIUsageDashboard />

      {/* Feature Registry Cards Grid */}
      <div className="space-y-3.5 w-full min-w-0">
        <h3 className="text-sm font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-400 shrink-0" />
          <span>Choose AI Capability ({Object.keys(features).length} Features)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full min-w-0">
          {Object.values(features).map((feat) => {
            const isSel = selectedFeatureId === feat.id;
            return (
              <div
                key={feat.id}
                onClick={() => setSelectedFeatureId(feat.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer space-y-2 shadow-sm w-full min-w-0 box-border ${
                  isSel
                    ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                    : 'bg-[var(--ox-surface-secondary)] border-[var(--ox-border)] hover:border-orange-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <span className="text-xs font-bold text-[var(--ox-text-primary)] min-w-0 flex-1 break-words leading-tight">
                    {feat.name}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 shrink-0 whitespace-nowrap">
                    {feat.requiredCredits} Credit{feat.requiredCredits > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--ox-text-secondary)] break-words leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Suite Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-5 sm:space-y-6 max-w-4xl mx-auto shadow-lg w-full min-w-0 box-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--ox-border)] w-full min-w-0">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0" />
              <span className="break-words">OpenRouter AI Execution Suite</span>
            </h3>
            <p className="text-xs text-[var(--ox-text-secondary)] mt-0.5 break-words">
              Configure parameters and execute real LLM generation
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto min-w-0">
            <button
              type="button"
              onClick={() => setIsBYOKModalOpen(true)}
              className="min-h-[40px] px-3.5 rounded-xl bg-[var(--ox-surface-primary)] hover:bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-xs font-bold text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Sliders className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>AI Settings</span>
            </button>

            <select
              value={selectedAIModel}
              onChange={(e) => setSelectedAIModel(e.target.value)}
              className="min-h-[40px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer w-full sm:w-auto max-w-full truncate"
            >
              {Object.values(models).map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2 w-full min-w-0 box-border">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="break-words flex-1 min-w-0">{errorMsg}</span>
          </div>
        )}

        {/* Cost Estimator Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-xs w-full min-w-0 box-border">
          <div className="min-w-0">
            <span className="text-[var(--ox-text-secondary)] text-[11px] sm:text-xs">Est. Tokens:</span>
            <strong className="text-[var(--ox-text-primary)] block font-mono text-xs sm:text-sm truncate">{costEstimate.totalTokens}</strong>
          </div>
          <div className="min-w-0">
            <span className="text-[var(--ox-text-secondary)] text-[11px] sm:text-xs">Est. Cost:</span>
            <strong className="text-emerald-400 block font-mono text-xs sm:text-sm truncate">${costEstimate.totalDollarCost}</strong>
          </div>
          <div className="min-w-0">
            <span className="text-[var(--ox-text-secondary)] text-[11px] sm:text-xs">Required Credits:</span>
            <strong className="text-orange-400 block font-mono text-xs sm:text-sm truncate">{activeFeature.requiredCredits} Credit</strong>
          </div>
          <div className="min-w-0">
            <span className="text-[var(--ox-text-secondary)] text-[11px] sm:text-xs">Status:</span>
            <strong className={`block font-mono text-xs sm:text-sm truncate ${isKeyActive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isKeyActive ? 'OpenRouter Ready' : 'Missing API Key'}
            </strong>
          </div>
        </div>

        {/* Tone Selector */}
        <div className="space-y-1.5 w-full min-w-0">
          <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Tone & Output Style</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full min-w-0">
            {['Professional', 'Friendly', 'Corporate', 'Technical'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`min-h-[40px] py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-w-0 truncate active:scale-95 ${
                  tone === t
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-sm'
                    : 'bg-[var(--ox-surface-primary)] text-[var(--ox-text-secondary)] border-[var(--ox-border)] hover:text-[var(--ox-text-primary)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="space-y-1.5 w-full min-w-0">
          <label className="text-xs font-semibold text-[var(--ox-text-secondary)]">Input Prompt / Existing Context</label>
          <textarea
            rows={3}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="w-full bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-xl p-3 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500 box-border min-w-0"
          />
        </div>

        {/* Execution Button */}
        <button
          type="button"
          onClick={handleRunOpenRouterRequest}
          disabled={isExecuting}
          className="w-full sm:w-auto min-h-[44px] px-4 sm:px-5 py-2.5 text-xs font-extrabold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-[0_0_18px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 text-center"
        >
          {isExecuting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
              <span className="truncate">Executing OpenRouter Request...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 shrink-0" />
              <span className="truncate">Run OpenRouter AI Generation ({activeFeature.requiredCredits} Credit)</span>
            </>
          )}
        </button>

        {/* Shimmering AI Response Skeleton Loader while executing */}
        {isExecuting && (
          <div className="p-4 sm:p-6 rounded-2xl border border-orange-500/30 bg-[var(--ox-surface-primary)] shadow-[0_0_25px_rgba(249,115,22,0.1)] space-y-4 animate-pulse w-full min-w-0 box-border">
            <div className="flex items-center justify-between border-b border-[var(--ox-border)] pb-3 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <span className="text-xs font-bold text-orange-400 truncate">Synthesizing AI Content with OpenRouter...</span>
              </div>
              <div className="h-5 w-16 rounded-md bg-orange-500/20 ox-skeleton shrink-0" />
            </div>
            <div className="space-y-2.5 w-full min-w-0">
              <div className="h-3.5 w-full rounded-md ox-skeleton" />
              <div className="h-3.5 w-[92%] rounded-md ox-skeleton" />
              <div className="h-3.5 w-[85%] rounded-md ox-skeleton" />
              <div className="h-3.5 w-[60%] rounded-md ox-skeleton" />
            </div>
          </div>
        )}

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

export default AIAssistantPage;

