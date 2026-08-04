/**
 * OpportunityX Resume — Ecosystem Identity Manager
 * Generates and manages the universal OpportunityX ID format: OX-USER-{YEAR}-{RANDOM_ID}
 */

const IDENTITY_KEY = 'opportunityx_universal_identity_v1';

export function generateUniversalOpportunityXID() {
  const year = new Date().getFullYear();
  const randomChars = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `OX-USER-${year}-${randomChars}`;
}

export function getOrCreateUniversalIdentity() {
  try {
    const saved = localStorage.getItem(IDENTITY_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.oxId) return parsed;
    }
  } catch (e) {}

  const oxId = generateUniversalOpportunityXID();
  const identity = {
    oxId,
    createdAt: new Date().toISOString(),
    linkedProducts: ['resume.opportunityx.co.in', 'career.opportunityx.co.in', 'verify.opportunityx.co.in', 'freelancing.opportunityx.co.in']
  };

  try {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
  } catch (e) {}

  return identity;
}
