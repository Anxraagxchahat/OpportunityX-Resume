/**
 * OpportunityX Resume — AI Error System
 * Standardized custom error classes for offline & BYOK execution.
 */

export class AIError extends Error {
  constructor(message, errorCode = 'AI_UNKNOWN_ERROR', providerId = 'gemini') {
    super(message);
    this.name = 'AIError';
    this.errorCode = errorCode;
    this.providerId = providerId;
  }
}

export class NoCreditsError extends AIError {
  constructor(providerId) {
    super('Monthly AI credits exhausted. Upgrade or enter custom BYOK API key.', 'NO_CREDITS_ERROR', providerId);
  }
}

export class InvalidApiKeyError extends AIError {
  constructor(providerId) {
    super(`Missing or invalid API key for ${providerId}.`, 'INVALID_API_KEY_ERROR', providerId);
  }
}

export class ProviderOfflineError extends AIError {
  constructor(providerId) {
    super(`Provider ${providerId} is currently unreachable.`, 'PROVIDER_OFFLINE_ERROR', providerId);
  }
}
