/**
 * OpportunityX Resume — AI Model Registry
 * Centralized catalog of supported LLMs with pricing and token specs.
 */

export const AI_MODELS = {
  'gpt-4.1': {
    id: 'gpt-4.1',
    name: 'OpenAI GPT-4.1 Turbo',
    provider: 'openai',
    inputCostPer1k: 0.0025,
    outputCostPer1k: 0.010,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 128000,
    status: 'Ready'
  },
  'gpt-5': {
    id: 'gpt-5',
    name: 'OpenAI GPT-5 (Next Gen)',
    provider: 'openai',
    inputCostPer1k: 0.005,
    outputCostPer1k: 0.015,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 200000,
    status: 'Phase 4 Preview'
  },
  'gemini-flash': {
    id: 'gemini-flash',
    name: 'Google Gemini 2.5 Flash (Fast)',
    provider: 'gemini',
    inputCostPer1k: 0.0003,
    outputCostPer1k: 0.0012,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 1000000,
    status: 'Ready'
  },
  'gemini-2.5-pro': {
    id: 'gemini-2.5-pro',
    name: 'Google Gemini 2.5 Pro',
    provider: 'gemini',
    inputCostPer1k: 0.00125,
    outputCostPer1k: 0.005,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 2000000,
    status: 'Ready'
  },
  'claude-sonnet': {
    id: 'claude-sonnet',
    name: 'Anthropic Claude 3.5 Sonnet',
    provider: 'anthropic',
    inputCostPer1k: 0.003,
    outputCostPer1k: 0.015,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 200000,
    status: 'Ready'
  },
  'claude-opus': {
    id: 'claude-opus',
    name: 'Anthropic Claude 3 Opus',
    provider: 'anthropic',
    inputCostPer1k: 0.015,
    outputCostPer1k: 0.075,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 200000,
    status: 'Ready'
  },
  'openrouter-auto': {
    id: 'openrouter-auto',
    name: 'OpenRouter Auto Router',
    provider: 'openrouter',
    inputCostPer1k: 0.001,
    outputCostPer1k: 0.003,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 128000,
    status: 'Ready'
  }
};

export function getModelById(modelId) {
  return AI_MODELS[modelId] || AI_MODELS['gemini-flash'];
}
