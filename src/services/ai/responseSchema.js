/**
 * OpportunityX Resume — Standardized AI Response Schema
 * Universal provider-independent response schema.
 */

export function createStandardAIResponse({
  status = 'Completed (Phase 3.5 Infrastructure)',
  providerId = 'gemini',
  modelId = 'gemini-flash',
  latencyMs = 120,
  tokensUsed = 240,
  creditsConsumed = 1,
  generatedContent = '',
  suggestions = [],
  errors = null
}) {
  return {
    status,
    providerId,
    modelId,
    latencyMs: `${latencyMs}ms`,
    tokensUsed,
    creditsConsumed,
    generatedContent: generatedContent || 'Architected high-concurrency microservices and full-stack interfaces processing 10M+ daily events with 99.99% availability. [Available in Phase 4]',
    suggestions: suggestions.length > 0 ? suggestions : ['Include quantitative metrics', 'Start with strong action verbs'],
    errors,
    timestamp: new Date().toISOString(),
    isPhase4Preview: true
  };
}
