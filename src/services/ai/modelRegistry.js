/**
 * OpportunityX Resume — AI Model Registry
 * Centralized catalog of supported LLMs with real OpenRouter model identifiers, pricing, and specs.
 */

export const AI_MODELS = {
  'google/gemini-2.5-flash': {
    id: 'google/gemini-2.5-flash',
    name: 'Google Gemini 2.5 Flash (Fast & Recommended)',
    provider: 'google',
    openrouterModelId: 'google/gemini-2.5-flash',
    inputCostPer1k: 0.00015,
    outputCostPer1k: 0.0006,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 1000000,
    status: 'Ready'
  },
  'openrouter/auto': {
    id: 'openrouter/auto',
    name: 'OpenRouter Auto Router (Best Latency/Price)',
    provider: 'openrouter',
    openrouterModelId: 'openrouter/auto',
    inputCostPer1k: 0.001,
    outputCostPer1k: 0.003,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 128000,
    status: 'Ready'
  },
  'openai/gpt-4o-mini': {
    id: 'openai/gpt-4o-mini',
    name: 'OpenAI GPT-4o Mini (Crisp & Accurate)',
    provider: 'openai',
    openrouterModelId: 'openai/gpt-4o-mini',
    inputCostPer1k: 0.00015,
    outputCostPer1k: 0.0006,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 128000,
    status: 'Ready'
  },
  'openai/gpt-4o': {
    id: 'openai/gpt-4o',
    name: 'OpenAI GPT-4o (High Precision)',
    provider: 'openai',
    openrouterModelId: 'openai/gpt-4o',
    inputCostPer1k: 0.0025,
    outputCostPer1k: 0.010,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 128000,
    status: 'Ready'
  },
  'anthropic/claude-3.5-haiku': {
    id: 'anthropic/claude-3.5-haiku',
    name: 'Anthropic Claude 3.5 Haiku (High Speed)',
    provider: 'anthropic',
    openrouterModelId: 'anthropic/claude-3.5-haiku',
    inputCostPer1k: 0.0008,
    outputCostPer1k: 0.004,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 200000,
    status: 'Ready'
  },
  'anthropic/claude-3.5-sonnet': {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Anthropic Claude 3.5 Sonnet (Executive Prose)',
    provider: 'anthropic',
    openrouterModelId: 'anthropic/claude-3.5-sonnet',
    inputCostPer1k: 0.003,
    outputCostPer1k: 0.015,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 200000,
    status: 'Ready'
  },
  'deepseek/deepseek-chat': {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3 (Reasoning & Code)',
    provider: 'deepseek',
    openrouterModelId: 'deepseek/deepseek-chat',
    inputCostPer1k: 0.00014,
    outputCostPer1k: 0.00028,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 64000,
    status: 'Ready'
  },
  'meta-llama/llama-3.3-70b-instruct': {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Meta Llama 3.3 70B Instruct',
    provider: 'meta',
    openrouterModelId: 'meta-llama/llama-3.3-70b-instruct',
    inputCostPer1k: 0.0004,
    outputCostPer1k: 0.0004,
    supportsStreaming: true,
    supportsJSON: true,
    maxContextTokens: 128000,
    status: 'Ready'
  }
};

/**
 * Legacy aliases for backwards compatibility with previously saved localStorage values.
 */
export const LEGACY_MODEL_ALIASES = {
  'gpt-4.1': 'openai/gpt-4o-mini',
  'gpt-4': 'openai/gpt-4o-mini',
  'gpt-5': 'openai/gpt-4o',
  'gemini-flash': 'google/gemini-2.5-flash',
  'gemini-2.5-pro': 'google/gemini-2.5-flash',
  'claude-sonnet': 'anthropic/claude-3.5-sonnet',
  'claude-opus': 'anthropic/claude-3.5-sonnet',
  'openrouter-auto': 'openrouter/auto'
};

/**
 * Resolves any model key or alias into a verified OpenRouter model identifier.
 * @param {string} modelId
 * @returns {string} Real OpenRouter model ID slug
 */
export function resolveOpenRouterModelId(modelId) {
  if (!modelId || typeof modelId !== 'string') {
    return 'google/gemini-2.5-flash';
  }

  const trimmed = modelId.trim();

  // Check alias map
  if (LEGACY_MODEL_ALIASES[trimmed]) {
    return LEGACY_MODEL_ALIASES[trimmed];
  }

  // Check direct match in AI_MODELS
  if (AI_MODELS[trimmed]) {
    return AI_MODELS[trimmed].openrouterModelId || AI_MODELS[trimmed].id;
  }

  // If already formatted as a provider/slug, use directly
  if (trimmed.includes('/')) {
    return trimmed;
  }

  // Default fallback
  return 'google/gemini-2.5-flash';
}

export function getModelById(modelId) {
  const resolvedId = resolveOpenRouterModelId(modelId);
  return AI_MODELS[resolvedId] || AI_MODELS['google/gemini-2.5-flash'];
}
