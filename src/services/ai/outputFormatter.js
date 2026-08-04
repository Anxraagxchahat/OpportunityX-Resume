/**
 * OpportunityX Resume — AI Output Formatter & Cleaner
 * Strips conversational conversational AI prefixes and normalizes production content.
 */

export function formatAIOutput(rawContent = '') {
  if (!rawContent || typeof rawContent !== 'string') return '';

  let text = rawContent.trim();

  // Strip common AI conversation intro prefixes
  text = text
    .replace(/^here (is|are) (your|the) (improved|rewritten|updated|generated) .*:?/i, '')
    .replace(/^certainly!?:?/i, '')
    .replace(/^sure,?:?/i, '')
    .replace(/^i'd be happy to (help|generate|rewrite).*:?/i, '')
    .replace(/^as an ai language model,?:?/i, '')
    .trim();

  // Strip outer quotes if enclosed in quotes
  if (text.startsWith('"') && text.endsWith('"')) {
    text = text.substring(1, text.length - 1).trim();
  }

  return text;
}
