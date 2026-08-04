/**
 * OpportunityX Resume — Centralized Feature Flag Manager
 * Manages feature flags across the OpportunityX ecosystem.
 */

export const FEATURE_FLAGS = {
  ai_assistant: { id: 'ai_assistant', name: 'AI Assistant', status: 'Enabled' },
  public_resume: { id: 'public_resume', name: 'Public Resume Links', status: 'Enabled' },
  verification: { id: 'verification', name: 'Resume Verification', status: 'Enabled' },
  freelancing_sync: { id: 'freelancing_sync', name: 'Freelancing Platform Sync', status: 'Enabled' },
  career_sync: { id: 'career_sync', name: 'Career Hub Sync', status: 'Enabled' },
  portfolio_sync: { id: 'portfolio_sync', name: 'Portfolio Sync', status: 'Beta' },
  cloud_sync: { id: 'cloud_sync', name: 'Cloud Auto Sync', status: 'Enabled' },
  collaboration: { id: 'collaboration', name: 'Shared Resume Collaboration', status: 'Coming Soon' }
};

export function isFeatureEnabled(featureId) {
  const flag = FEATURE_FLAGS[featureId];
  return flag ? flag.status === 'Enabled' || flag.status === 'Beta' : true;
}
