/**
 * OpportunityX Resume — AI Local Response Cache & History Manager
 * Caches successful AI outputs in LocalStorage to prevent redundant credit usage.
 */

const CACHE_KEY = 'opportunityx_ai_response_cache_v1';
const HISTORY_KEY = 'opportunityx_ai_history_v1';

export function getCachedResponse(featureId, inputText, modelId) {
  try {
    const cachedStr = localStorage.getItem(CACHE_KEY);
    if (!cachedStr) return null;
    const cacheMap = JSON.parse(cachedStr);
    const key = `${featureId}_${inputText.trim().substr(0, 50)}_${modelId}`;
    return cacheMap[key] || null;
  } catch (e) {
    return null;
  }
}

export function setCachedResponse(featureId, inputText, modelId, responseData) {
  try {
    const cachedStr = localStorage.getItem(CACHE_KEY);
    const cacheMap = cachedStr ? JSON.parse(cachedStr) : {};
    const key = `${featureId}_${inputText.trim().substr(0, 50)}_${modelId}`;
    cacheMap[key] = {
      ...responseData,
      cachedAt: new Date().toISOString()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheMap));

    // Log to History
    logAIHistory(featureId, modelId, responseData);
  } catch (e) {}
}

export function logAIHistory(featureId, modelId, responseData) {
  try {
    const historyStr = localStorage.getItem(HISTORY_KEY);
    const history = historyStr ? JSON.parse(historyStr) : [];
    const entry = {
      id: `ai-log-${Date.now()}`,
      featureId,
      modelId,
      timestamp: new Date().toISOString(),
      contentPreview: (responseData.generatedContent || '').substr(0, 80),
      creditsUsed: responseData.creditsConsumed || 1
    };
    localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...history.slice(0, 49)]));
  } catch (e) {}
}

export function getAIHistory() {
  try {
    const historyStr = localStorage.getItem(HISTORY_KEY);
    return historyStr ? JSON.parse(historyStr) : [];
  } catch (e) {
    return [];
  }
}
