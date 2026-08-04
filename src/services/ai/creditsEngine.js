/**
 * OpportunityX Resume — AI Credits Engine & Token Cost Estimator
 * Pre-estimates token consumption, dollar costs, and credit requirements.
 */

import { getModelById } from './modelRegistry';

export function estimateTokenCost(inputText = '', selectedModelId = 'gemini-flash', requiredCredits = 1) {
  const model = getModelById(selectedModelId);

  // Rough estimation: 1 word ~ 1.33 tokens
  const words = inputText.trim().split(/\s+/).filter(Boolean).length || 10;
  const estimatedInputTokens = Math.ceil(words * 1.33) + 250; // Add system prompt tokens
  const estimatedOutputTokens = 350; // Average response length
  const totalTokens = estimatedInputTokens + estimatedOutputTokens;

  // Dollar cost estimation
  const inputCost = (estimatedInputTokens / 1000) * model.inputCostPer1k;
  const outputCost = (estimatedOutputTokens / 1000) * model.outputCostPer1k;
  const totalDollarCost = inputCost + outputCost;

  return {
    modelId: selectedModelId,
    modelName: model.name,
    estimatedInputTokens,
    estimatedOutputTokens,
    totalTokens,
    totalDollarCost: totalDollarCost.toFixed(5),
    requiredCredits,
    isWithinLimit: true
  };
}
