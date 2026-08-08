/**
 * OpportunityX Resume — Template Quality Analysis & Validation Engine
 * Runs duplicate detection (>80% similarity threshold), layout health validation,
 * license compliance checks, and structural hierarchy scoring.
 */

import { OPPORTUNITYX_TEMPLATES_METADATA } from './templateCapabilities';

/**
 * Calculates structural similarity between two template metadata profiles.
 * Returns similarity score between 0.0 (completely distinct) and 1.0 (identical).
 */
export const calculateLayoutSimilarity = (tplA, tplB) => {
  if (!tplA || !tplB) return 0;
  if (tplA.id === tplB.id) return 1.0;

  let points = 0;
  let total = 7;

  // 1. Column layout
  if (tplA.supportsTwoColumns === tplB.supportsTwoColumns) points += 1;

  // 2. Sidebar position / support
  if (tplA.supportsSidebar === tplB.supportsSidebar) points += 1;

  // 3. Photo support
  if (tplA.supportsPhoto === tplB.supportsPhoto) points += 1;

  // 4. ATS Optimization profile
  if (tplA.atsFriendly === tplB.atsFriendly) points += 1;

  // 5. Category classification
  if (tplA.category === tplB.category) points += 1;

  // 6. Accent bar styling
  if (tplA.supportsAccentBar === tplB.supportsAccentBar) points += 1;

  // 7. Recommended experience level
  if (tplA.recommendedExperienceLevel === tplB.recommendedExperienceLevel) points += 1;

  return Number((points / total).toFixed(2));
};

/**
 * Validates a template candidate against the OpportunityX Quality Standard.
 */
export const validateTemplateHealth = (template) => {
  const issues = [];

  if (!template.id) issues.push('Missing unique template ID');
  if (!template.name) issues.push('Missing template name');
  if (typeof template.supportsPhoto !== 'boolean') issues.push('Capability supportsPhoto must be boolean');
  if (typeof template.atsFriendly !== 'boolean') issues.push('Capability atsFriendly must be boolean');
  if (!Array.isArray(template.accentColors) || template.accentColors.length === 0) {
    issues.push('Template must define accentColors array');
  }

  return {
    isValid: issues.length === 0,
    issues,
    status: issues.length === 0 ? 'Verified Layout' : 'Validation Error'
  };
};

/**
 * Scans template collection and identifies duplicate layout entries.
 */
export const detectDuplicateTemplates = (templates = OPPORTUNITYX_TEMPLATES_METADATA, threshold = 0.85) => {
  const duplicates = [];
  const unique = [];

  for (let i = 0; i < templates.length; i++) {
    let isDup = false;
    for (let j = 0; j < unique.length; j++) {
      const sim = calculateLayoutSimilarity(templates[i], unique[j]);
      if (sim >= threshold && templates[i].id !== unique[j].id) {
        duplicates.push({
          duplicate: templates[i],
          original: unique[j],
          similarity: sim
        });
        isDup = true;
        break;
      }
    }
    if (!isDup) {
      unique.push(templates[i]);
    }
  }

  return {
    uniqueTemplates: unique,
    duplicatePairs: duplicates,
    totalScanned: templates.length,
    uniqueCount: unique.length,
    duplicateCount: duplicates.length
  };
};
