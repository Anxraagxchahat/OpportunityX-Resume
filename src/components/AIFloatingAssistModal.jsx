import React, { useState } from 'react';
import { X, Sparkles, Wand2, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { executeOpenRouterRequest } from '../services/ai/providerManager';
import { buildMinimalContext } from '../services/ai/contextBuilder';
import { getPromptTemplate } from '../services/ai/promptLibrary';
import { injectPromptVariables } from '../services/ai/promptVariableEngine';
import { getCachedResponse, setCachedResponse } from '../services/ai/responseCache';
import { AIResponseViewer } from './AIResponseViewer';

export const AIFloatingAssistModal = ({
  isOpen,
  onClose,
  targetField = 'summary',
  initialText = '',
  onApply = () => {}
}) => {
  const { activeResume, selectedAIModel, aiCredits, consumeCredit, checkAIAccess, byokKeys, executeAIGeneration } = useResume();
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [responsePayload, setResponsePayload] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setErrorMsg(null);

    // 1. Check Auth & AI Credits Access
    if (!checkAIAccess(`AI ${targetField.toUpperCase()}`)) {
      return;
    }

    setIsGenerating(true);

    try {
      // 2. Build minimal context
      const featureName = targetField === 'summary' ? 'summary_generator' : 'experience_rewrite';
      const contextPayload = buildMinimalContext(featureName, activeResume, { textToFix: initialText, selectedItem: initialText });

      // 3. Execute via Authoritative Server-Side AI Pipeline
      const response = await executeAIGeneration({
        feature: featureName,
        prompt: initialText || undefined,
        content: contextPayload,
        model: selectedAIModel,
        targetRole: activeResume?.personal?.jobTitle || activeResume?.personal?.targetRole
      });

      if (response && response.result) {
        const textResult = typeof response.result === 'string' ? response.result : JSON.stringify(response.result, null, 2);
        const resultObj = {
          generatedContent: textResult,
          modelUsed: response.model_used || selectedAIModel
        };

        setCachedResponse(targetField, initialText, selectedAIModel, resultObj);
        setResponsePayload(resultObj);
      }
    } catch (err) {
      console.error("AI Request Failed:", err);
      setErrorMsg(err.message || "Failed to generate AI content. No credit was deducted.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyResult = () => {
    if (responsePayload?.generatedContent) {
      onApply(responsePayload.generatedContent);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">AI Resume Assistant</h3>
              <p className="text-xs text-slate-400">({aiCredits.remaining} credits remaining)</p>
            </div>
          </div>

          {/* AI Branding Badge */}
          <div className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
            Powered by AI • Uses 1 AI Credit
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

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

        {/* Execution Control */}
        <div className="pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Generating via AI...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" /> Run AI Generation (1 Credit)
              </>
            )}
          </button>
        </div>

        {/* Response Viewer */}
        {responsePayload && (
          <AIResponseViewer
            originalText={initialText}
            improvedText={responsePayload.generatedContent}
            creditsUsed={responsePayload.creditsConsumed}
            latencyMs={responsePayload.latencyMs}
            onAccept={handleApplyResult}
            onReject={() => setResponsePayload(null)}
            onRegenerate={handleGenerate}
          />
        )}
      </div>
    </div>
  );
};

