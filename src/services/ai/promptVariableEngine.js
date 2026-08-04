/**
 * OpportunityX Resume — Prompt Variable Engine
 * Replaces structured variables without manual string concatenation.
 */

export function injectPromptVariables(templateString = '', variables = {}) {
  let result = templateString;

  Object.entries(variables).forEach(([key, val]) => {
    const valueStr = typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val || '');
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, valueStr);
  });

  return result;
}
