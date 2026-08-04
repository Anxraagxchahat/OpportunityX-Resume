/**
 * OpportunityX Resume — Ecosystem Product Registry & Plugin System
 * Central catalog of all OpportunityX subdomains and connected apps.
 */

export const ECOSYSTEM_PRODUCTS = {
  resume: {
    id: 'resume',
    name: 'OpportunityX Resume',
    subdomain: 'resume.opportunityx.co.in',
    status: 'Active Module',
    version: '1.0.0',
    lastSync: 'Just now',
    connectionState: 'Connected',
    healthStatus: 'Optimal'
  },
  career: {
    id: 'career',
    name: 'OpportunityX Career Hub',
    subdomain: 'career.opportunityx.co.in',
    status: 'Connected App',
    version: '2.1.0',
    lastSync: '5 mins ago',
    connectionState: 'Connected',
    healthStatus: 'Optimal'
  },
  verify: {
    id: 'verify',
    name: 'OpportunityX Verification Engine',
    subdomain: 'verify.opportunityx.co.in',
    status: 'Connected App',
    version: '1.4.0',
    lastSync: '10 mins ago',
    connectionState: 'Connected',
    healthStatus: 'Optimal'
  },
  freelancing: {
    id: 'freelancing',
    name: 'OpportunityX Freelancing Platform',
    subdomain: 'freelancing.opportunityx.co.in',
    status: 'Connected App',
    version: '1.8.0',
    lastSync: '15 mins ago',
    connectionState: 'Connected',
    healthStatus: 'Optimal'
  },
  portfolio: {
    id: 'portfolio',
    name: 'OpportunityX Portfolio Builder',
    subdomain: 'portfolio.opportunityx.co.in',
    status: 'Connected App',
    version: '1.2.0',
    lastSync: '1 hour ago',
    connectionState: 'Connected',
    healthStatus: 'Optimal'
  }
};

export const FUTURE_PLUGINS = [
  { id: 'interview_hub', name: 'OpportunityX Interview Hub', tag: 'Plugin Ready' },
  { id: 'scholarships', name: 'OpportunityX Scholarships', tag: 'Plugin Ready' },
  { id: 'hackathons', name: 'OpportunityX Hackathons Engine', tag: 'Plugin Ready' },
  { id: 'jobs', name: 'OpportunityX Jobs Matcher', tag: 'Plugin Ready' },
  { id: 'ai_coach', name: 'OpportunityX AI Career Coach', tag: 'Plugin Ready' }
];

export function getAllProducts() {
  return Object.values(ECOSYSTEM_PRODUCTS);
}
