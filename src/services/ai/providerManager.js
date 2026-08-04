/**
 * OpportunityX Resume — AI Provider Manager & OpenRouter Execution Engine
 * Real HTTP fetch executor for OpenRouter (https://openrouter.ai/api/v1/chat/completions).
 */

import { formatAIOutput } from './outputFormatter';
import { validateAIResponseQuality } from './qualityLayer';
import { createStandardAIResponse } from './responseSchema';

export const PROVIDERS = {
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter (Default)',
    defaultModel: 'openrouter/auto',
    description: 'Unified gateway connecting 100+ open source and commercial models.'
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (Future)',
    defaultModel: 'gpt-4.1',
    description: 'Industry standard for structured JSON & prompt instruction following.'
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini (Future)',
    defaultModel: 'gemini-flash',
    description: 'High-speed long-context provider tailored for resume analysis.'
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude (Future)',
    defaultModel: 'claude-sonnet',
    description: 'Superior nuanced prose generation for executive summaries.'
  }
};

export function getProviderHealth(providerId, byokKeys = {}) {
  const provider = PROVIDERS[providerId] || PROVIDERS.openrouter;
  const key = byokKeys[providerId]?.trim() || import.meta.env.VITE_OPENROUTER_API_KEY;

  if (key && key.length > 8) {
    return {
      providerId,
      status: 'Ready',
      badgeLabel: 'Ready (API Key Active)',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      isConfigured: true,
      canExecute: true
    };
  }

  return {
    providerId,
    status: 'Not Configured',
    badgeLabel: 'Not Configured',
    color: 'bg-[#10131D] text-slate-500 border-slate-800',
    isConfigured: false,
    canExecute: false
  };
}

export function getAllProvidersHealth(byokKeys = {}) {
  return Object.keys(PROVIDERS).map((id) => getProviderHealth(id, byokKeys));
}

/**
 * Real OpenRouter Execution Engine (with 1-time Automatic Retry for Reliability)
 */
export async function executeOpenRouterRequest({
  modelId = 'openrouter/auto',
  systemPrompt = '',
  userPrompt = '',
  apiKey = '',
  temperature = 0.7
}) {
  const startTime = Date.now();
  const effectiveApiKey = apiKey?.trim() || import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!effectiveApiKey) {
    throw new Error("OpenRouter API key is missing. Please configure key in .env or AI Settings.");
  }

  const makeAttempt = async () => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${effectiveApiKey}`,
        'HTTP-Referer': 'https://resume.opportunityx.co.in',
        'X-Title': 'OpportunityX Resume Engine',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelId.includes('/') ? modelId : 'google/gemini-2.5-flash:free',
        messages: [
          { role: 'system', content: systemPrompt || 'You are an executive resume writing assistant.' },
          { role: 'user', content: userPrompt }
        ],
        temperature
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenRouter API Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const rawContent = data?.choices?.[0]?.message?.content || '';
    if (!rawContent || !rawContent.trim()) {
      throw new Error("Received empty response from AI model.");
    }
    const formatted = formatAIOutput(rawContent);

    // Validate Quality & Truthfulness
    const quality = validateAIResponseQuality(formatted, userPrompt);
    if (!quality.isValid) {
      console.warn("Quality validation warning:", quality.reason);
    }

    const latencyMs = Date.now() - startTime;
    const tokensUsed = data?.usage?.total_tokens || 250;

    return createStandardAIResponse({
      status: 'Completed (OpenRouter Live)',
      providerId: 'openrouter',
      modelId,
      latencyMs,
      tokensUsed,
      creditsConsumed: 1,
      generatedContent: formatted
    });
  };

  // Requirement 8: Retry once before failing
  try {
    return await makeAttempt();
  } catch (firstErr) {
    console.warn("First OpenRouter attempt failed, retrying once...", firstErr);
    try {
      return await makeAttempt();
    } catch (secondErr) {
      console.error("OpenRouter Execution Error after 1 retry:", secondErr);
      throw secondErr;
    }
  }
}

