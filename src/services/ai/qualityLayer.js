/**
 * OpportunityX Resume — AI Safety & Truthfulness Quality Layer
 * Validates AI responses for length, empty strings, duplicates, and truthfulness.
 */

export function validateAIResponseQuality(rawText, originalContextText = '') {
  if (!rawText || !rawText.trim()) {
    return { isValid: false, reason: 'Empty response returned from AI provider.' };
  }

  const clean = rawText.trim();

  if (clean.length < 15) {
    return { isValid: false, reason: 'Response is too short to be production-ready.' };
  }

  // Check for duplicate response
  if (originalContextText && clean.toLowerCase() === originalContextText.trim().toLowerCase()) {
    return { isValid: false, reason: 'AI returned an identical duplicate of original input.' };
  }

  // Truthfulness Audit (Warning if response invents fake degrees like Ph.D or unknown companies)
  const containsFabricatedDegree = /Doctor of Philosophy|Ph\.D\.|Harvard Business School/i.test(clean) && !/Doctor|Ph\.D|Harvard/i.test(originalContextText);
  if (containsFabricatedDegree) {
    return { isValid: false, reason: 'Safety Layer Flag: AI response introduced fabricated credentials not present in original resume.' };
  }

  return { isValid: true, reason: 'Passed Quality & Truthfulness Audit' };
}
