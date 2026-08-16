/**
 * OpportunityX Resume — AI Provider Manager & OpenRouter Execution Engine
 * Real HTTP fetch executor for OpenRouter (https://openrouter.ai/api/v1/chat/completions).
 */

import { formatAIOutput } from './outputFormatter';
import { validateAIResponseQuality } from './qualityLayer';
import { createStandardAIResponse } from './responseSchema';
import { resolveOpenRouterModelId } from './modelRegistry';

export const PROVIDERS = {
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter (Multi-Model Gateway)',
    defaultModel: 'google/gemini-2.5-flash',
    description: 'Unified gateway connecting Google Gemini, OpenAI, Anthropic, DeepSeek, and Meta models.'
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (via OpenRouter)',
    defaultModel: 'openai/gpt-4o-mini',
    description: 'Industry standard for structured formatting and crisp bullet generation.'
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini (via OpenRouter)',
    defaultModel: 'google/gemini-2.5-flash',
    description: 'High-speed long-context LLMs tailored for rapid resume and ATS analysis.'
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude (via OpenRouter)',
    defaultModel: 'anthropic/claude-3.5-haiku',
    description: 'Superior nuanced prose generation for executive summaries and cover letters.'
  }
};

/**
 * Checks provider readiness and active key configuration.
 * @param {string} providerId
 * @param {Object} byokKeys
 * @returns {Object} Health status
 */
export function getProviderHealth(providerId, byokKeys = {}) {
  const provider = PROVIDERS[providerId] || PROVIDERS.openrouter;
  const key = byokKeys[providerId]?.trim() || byokKeys.openrouter?.trim() || import.meta.env.VITE_OPENROUTER_API_KEY;

  if (key && typeof key === 'string' && key.trim().length > 10) {
    return {
      providerId,
      status: 'Ready',
      badgeLabel: 'Active & Connected',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      isConfigured: true,
      canExecute: true
    };
  }

  return {
    providerId,
    status: 'Not Configured',
    badgeLabel: 'API Key Missing',
    color: 'bg-[#10131D] text-slate-500 border-slate-800',
    isConfigured: false,
    canExecute: false
  };
}

export function getAllProvidersHealth(byokKeys = {}) {
  return Object.keys(PROVIDERS).map((id) => getProviderHealth(id, byokKeys));
}

/**
 * Parses and maps OpenRouter HTTP error codes into user-friendly diagnostic messages.
 */
function parseOpenRouterError(status, errBodyText, modelUsed) {
  let errorJson = null;
  try {
    errorJson = JSON.parse(errBodyText);
  } catch (e) {}

  const serverMsg = errorJson?.error?.message || errorJson?.message || '';

  if (status === 401) {
    return 'Authentication failed: The OpenRouter API key is invalid or unauthorized. Please verify your API key in AI Settings or .env.';
  }

  if (status === 402) {
    return 'Insufficient OpenRouter credits: Your OpenRouter account has run out of credits. Please top up your balance at openrouter.ai/credits.';
  }

  if (status === 403) {
    return `Access forbidden: Your OpenRouter key does not have permission to access model '${modelUsed}'.`;
  }

  if (status === 404 || (status === 400 && serverMsg.toLowerCase().includes('model'))) {
    return `Model unavailable: '${modelUsed}' could not be loaded on OpenRouter. Please select a different model in AI Settings.`;
  }

  if (status === 429) {
    return 'Rate limit exceeded: OpenRouter received too many requests. Please wait a few seconds and try again.';
  }

  if (status >= 500) {
    return `OpenRouter server error (${status}): The upstream AI provider is temporarily unavailable. Please retry in a moment.`;
  }

  return `OpenRouter API Error (${status}): ${serverMsg || errBodyText.slice(0, 200)}`;
}

/**
 * Real OpenRouter Execution Engine (with 1-time Automatic Retry for Reliability)
 */
export async function executeOpenRouterRequest({
  modelId = 'google/gemini-2.5-flash',
  systemPrompt = '',
  userPrompt = '',
  apiKey = '',
  temperature = 0.7,
  maxTokens = 2500
}) {
  const startTime = Date.now();
  const effectiveApiKey = apiKey?.trim() || import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!effectiveApiKey || typeof effectiveApiKey !== 'string' || !effectiveApiKey.trim()) {
    throw new Error('OpenRouter API key is missing. Please configure key in .env or AI Settings.');
  }

  const resolvedModel = resolveOpenRouterModelId(modelId);

  const makeAttempt = async () => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${effectiveApiKey.trim()}`,
        'HTTP-Referer': 'https://resume.opportunityx.co.in',
        'X-Title': 'OpportunityX Resume Engine',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: resolvedModel,
        messages: [
          { role: 'system', content: systemPrompt || 'You are an expert ATS resume and career advisor.' },
          { role: 'user', content: userPrompt }
        ],
        temperature: typeof temperature === 'number' ? temperature : 0.7,
        max_tokens: maxTokens
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      const friendlyError = parseOpenRouterError(res.status, errText, resolvedModel);
      throw new Error(friendlyError);
    }

    const data = await res.json();
    const rawContent = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.message?.reasoning || data?.choices?.[0]?.text || '';
    if (!rawContent || !rawContent.trim()) {
      throw new Error('Received empty response from AI model. Please retry.');
    }
    const formatted = formatAIOutput(rawContent);

    // Validate Quality & Truthfulness
    const quality = validateAIResponseQuality(formatted, userPrompt);
    if (!quality.isValid) {
      console.warn('Quality validation warning:', quality.reason);
    }

    const latencyMs = Date.now() - startTime;
    const tokensUsed = data?.usage?.total_tokens || 250;

    return createStandardAIResponse({
      status: 'Completed (OpenRouter Live)',
      providerId: 'openrouter',
      modelId: resolvedModel,
      latencyMs,
      tokensUsed,
      creditsConsumed: 1,
      generatedContent: formatted
    });
  };

  // Automatic 1-time retry for transient network hiccups
  try {
    return await makeAttempt();
  } catch (firstErr) {
    // If it is an auth error (401) or credit error (402), do not retry pointlessly
    if (
      firstErr.message.includes('Authentication failed') ||
      firstErr.message.includes('Insufficient OpenRouter credits') ||
      firstErr.message.includes('missing')
    ) {
      throw firstErr;
    }

    console.warn('First OpenRouter attempt failed, retrying once...', firstErr.message);
    try {
      return await makeAttempt();
    } catch (secondErr) {
      console.error('OpenRouter Execution Error after retry:', secondErr);
      throw secondErr;
    }
  }
}
