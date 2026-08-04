import { useMemo, useCallback } from 'react';
import { useResume } from '../context/ResumeContext';
import { AI_FEATURES, getFeatureById } from '../services/ai/featureRegistry';
import { PROVIDERS, getProviderHealth } from '../services/ai/providerManager';
import { AI_MODELS, getModelById } from '../services/ai/modelRegistry';
import { estimateTokenCost } from '../services/ai/creditsEngine';
import { getPromptTemplate } from '../services/ai/promptLibrary';
import { createStandardAIResponse } from '../services/ai/responseSchema';

export function useAIInfrastructure() {
  const { aiCredits, consumeCredit, byokKeys, saveByokKeys } = useResume();

  const providerHealthList = useMemo(() => {
    return Object.keys(PROVIDERS).map((pId) => getProviderHealth(pId, byokKeys));
  }, [byokKeys]);

  const estimateCost = useCallback((text, modelId, requiredCredits) => {
    return estimateTokenCost(text, modelId, requiredCredits);
  }, []);

  const simulateAIRequest = useCallback((featureId, inputText, selectedModelId = 'gemini-flash') => {
    const feature = getFeatureById(featureId);
    const costEstimate = estimateTokenCost(inputText, selectedModelId, feature.requiredCredits);
    const prompt = getPromptTemplate(featureId);

    const response = createStandardAIResponse({
      status: 'Phase 3.5 Infrastructure Ready',
      providerId: getModelById(selectedModelId).provider,
      modelId: selectedModelId,
      creditsConsumed: feature.requiredCredits,
      generatedContent: `[Phase 3.5 Infrastructure Preview] Simulated response for ${feature.name}. Actual API generation arrives in Phase 4.`
    });

    return {
      feature,
      costEstimate,
      prompt,
      response
    };
  }, []);

  return {
    features: AI_FEATURES,
    providers: PROVIDERS,
    models: AI_MODELS,
    providerHealthList,
    aiCredits,
    consumeCredit,
    byokKeys,
    saveByokKeys,
    estimateCost,
    simulateAIRequest
  };
}
