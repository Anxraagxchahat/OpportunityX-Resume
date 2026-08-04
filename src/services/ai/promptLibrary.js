/**
 * OpportunityX Resume — Centralized Prompt Library
 * Separate prompt templates. Application code never hardcodes prompts inside UI components.
 */

export const PROMPT_TEMPLATES = {
  summary_generator: {
    id: 'summary_generator',
    title: 'Executive Summary Prompt',
    systemPrompt: 'You are an executive resume writing assistant specializing in high-impact tech resumes.',
    userPromptTemplate: (text, role = 'Software Engineer') =>
      `Generate a compelling 3-4 sentence professional executive summary for a ${role} based on the following background:\n"${text}"`
  },
  experience_rewrite: {
    id: 'experience_rewrite',
    title: 'Experience Bullet Enhancer Prompt',
    systemPrompt: 'You are an ATS optimization specialist. Format bullet points using Google XYZ metric frameworks (Accomplished X by Y resulting in Z).',
    userPromptTemplate: (text) =>
      `Rewrite the following work experience bullet point starting with a high-impact action verb and incorporating quantifiable metrics:\n"${text}"`
  },
  project_generator: {
    id: 'project_generator',
    title: 'Technical Project Prompt',
    systemPrompt: 'You are a senior technical architect specializing in engineering portfolio writeups.',
    userPromptTemplate: (text) =>
      `Construct a 2-sentence technical project summary highlighting system architecture and tech stack choices for:\n"${text}"`
  },
  grammar_fix: {
    id: 'grammar_fix',
    title: 'Grammar & Tone Optimizer Prompt',
    systemPrompt: 'You are a professional copyeditor.',
    userPromptTemplate: (text) =>
      `Correct passive voice, fix grammatical errors, and polish executive tone for:\n"${text}"`
  },
  ats_improvement: {
    id: 'ats_improvement',
    title: 'ATS Keyword Injection Prompt',
    systemPrompt: 'You are an ATS compliance auditor.',
    userPromptTemplate: (text, missingKeywords = []) =>
      `Incorporate the following missing technical keywords [${missingKeywords.join(', ')}] into this text naturally:\n"${text}"`
  }
};

export function getPromptTemplate(featureId) {
  return PROMPT_TEMPLATES[featureId] || PROMPT_TEMPLATES.summary_generator;
}
