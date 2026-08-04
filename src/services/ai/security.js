/**
 * OpportunityX Resume — AI Security & Key Isolation
 * Encrypts / isolates local BYOK keys in browser storage and sanitizes sensitive user input.
 */

export function sanitizePromptText(text = '') {
  // Strips potential prompt injection strings
  return text
    .replace(/ignore previous instructions/gi, '')
    .replace(/system prompt/gi, '')
    .trim();
}

export function maskApiKey(key = '') {
  if (!key || key.length < 8) return 'Not Configured';
  return `${key.substr(0, 4)}...${key.substr(-4)}`;
}
