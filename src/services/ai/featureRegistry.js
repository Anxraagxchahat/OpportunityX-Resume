/**
 * OpportunityX Resume — Centralized AI Feature Registry
 * Central catalog of all application AI capabilities.
 */

export const AI_FEATURES = {
  SUMMARY_GENERATOR: {
    id: 'summary_generator',
    name: 'Executive Summary Generator',
    description: 'Generates high-impact professional summaries tailored to target job titles.',
    requiredCredits: 1,
    supportedProviders: ['openai', 'gemini', 'openrouter', 'anthropic'],
    supportedModels: ['gpt-4.1', 'gemini-flash', 'claude-sonnet'],
    supportsStreaming: true,
    supportsJSON: true,
    status: 'Phase 4 Ready'
  },
  EXPERIENCE_REWRITE: {
    id: 'experience_rewrite',
    name: 'Work Experience Bullet Enhancer',
    description: 'Rewrites weak bullet points using metric-driven XYZ frameworks (Accomplished X by Y resulting in Z).',
    requiredCredits: 1,
    supportedProviders: ['openai', 'gemini', 'openrouter', 'anthropic'],
    supportedModels: ['gpt-4.1', 'gemini-flash', 'claude-sonnet'],
    supportsStreaming: true,
    supportsJSON: true,
    status: 'Phase 4 Ready'
  },
  PROJECT_GENERATOR: {
    id: 'project_generator',
    name: 'Technical Project Description Generator',
    description: 'Constructs technical project overviews highlighting architecture and stack choices.',
    requiredCredits: 1,
    supportedProviders: ['openai', 'gemini', 'anthropic'],
    supportedModels: ['gpt-4.1', 'gemini-2.5-pro', 'claude-sonnet'],
    supportsStreaming: true,
    supportsJSON: true,
    status: 'Phase 4 Ready'
  },
  GRAMMAR_FIX: {
    id: 'grammar_fix',
    name: 'Grammar & Tone Optimizer',
    description: 'Cleans up passive voice, corrects typos, and polishes professional executive tone.',
    requiredCredits: 1,
    supportedProviders: ['openai', 'gemini', 'openrouter', 'anthropic'],
    supportedModels: ['gemini-flash', 'gpt-4.1'],
    supportsStreaming: true,
    supportsJSON: false,
    status: 'Phase 4 Ready'
  },
  ATS_IMPROVEMENT: {
    id: 'ats_improvement',
    name: 'ATS Keyword Injector',
    description: 'Suggests high-relevance technical skills and keywords to pass target job ATS filters.',
    requiredCredits: 1,
    supportedProviders: ['openai', 'gemini', 'anthropic'],
    supportedModels: ['gpt-4.1', 'gemini-2.5-pro'],
    supportsStreaming: false,
    supportsJSON: true,
    status: 'Phase 4 Ready'
  },
  JOB_MATCH: {
    id: 'job_match',
    name: 'Job Description Match Generator',
    description: 'Extracts skill gaps and generates bullet points matching a target Job Description.',
    requiredCredits: 2,
    supportedProviders: ['openai', 'gemini', 'anthropic'],
    supportedModels: ['gpt-4.1', 'claude-sonnet'],
    supportsStreaming: true,
    supportsJSON: true,
    status: 'Phase 4 Ready'
  },
  LINKEDIN_GENERATOR: {
    id: 'linkedin_generator',
    name: 'LinkedIn About Generator',
    description: 'Converts resume data into a compelling 3-paragraph LinkedIn About section.',
    requiredCredits: 1,
    supportedProviders: ['openai', 'gemini', 'anthropic'],
    supportedModels: ['gemini-flash', 'gpt-4.1'],
    supportsStreaming: true,
    supportsJSON: false,
    status: 'Phase 4 Ready'
  },
  COVER_LETTER: {
    id: 'cover_letter',
    name: 'Targeted Cover Letter Builder',
    description: 'Generates a tailored 1-page cover letter matching resume achievements to job post requirements.',
    requiredCredits: 2,
    supportedProviders: ['openai', 'gemini', 'anthropic'],
    supportedModels: ['gpt-4.1', 'claude-sonnet'],
    supportsStreaming: true,
    supportsJSON: false,
    status: 'Phase 4 Ready'
  },
  INTERVIEW_PREP: {
    id: 'interview_prep',
    name: 'Technical Interview Prep Assistant',
    description: 'Generates potential behavioral and system design interview questions based on resume experience.',
    requiredCredits: 2,
    supportedProviders: ['openai', 'gemini', 'anthropic'],
    supportedModels: ['gpt-4.1', 'gemini-2.5-pro'],
    supportsStreaming: true,
    supportsJSON: true,
    status: 'Phase 4 Ready'
  }
};

export function getFeatureById(featureId) {
  return Object.values(AI_FEATURES).find((f) => f.id === featureId) || AI_FEATURES.SUMMARY_GENERATOR;
}
