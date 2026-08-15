import React, { lazy } from 'react';
import { getTemplateCapabilities, OPPORTUNITYX_TEMPLATES_METADATA } from '../utils/templateCapabilities';

export { getTemplateCapabilities, OPPORTUNITYX_TEMPLATES_METADATA };

/**
 * Resilient lazy loader that intercepts chunk loading failures after deployments
 * and prompts a clean hard-reload instead of failing silently or crashing.
 */
function safeLazy(importFn) {
  return lazy(() =>
    importFn().catch((err) => {
      if (typeof window !== 'undefined') {
        const lastReload = parseInt(sessionStorage.getItem('ox_chunk_reload_ts') || '0', 10);
        const now = Date.now();
        if (now - lastReload > 10000) {
          sessionStorage.setItem('ox_chunk_reload_ts', String(now));
          window.location.reload();
        }
      }
      throw err;
    })
  );
}

// ──────────────────────────────────────────
// OpportunityX Core Templates (Lazy Loaded)
// ──────────────────────────────────────────
export const LazyModernATS = safeLazy(() => import('./ModernATS/ModernATSTemplate').then(m => ({ default: m.ModernATSTemplate })));
export const LazyMinimalATS = safeLazy(() => import('./MinimalATS/MinimalATSTemplate').then(m => ({ default: m.MinimalATSTemplate })));
export const LazyExecutiveATS = safeLazy(() => import('./ExecutiveATS/ExecutiveATSTemplate').then(m => ({ default: m.ExecutiveATSTemplate })));
export const LazyCorporateATS = safeLazy(() => import('./CorporateATS/CorporateATSTemplate').then(m => ({ default: m.CorporateATSTemplate })));
export const LazyRecruiterATS = safeLazy(() => import('./RecruiterATS/RecruiterATSTemplate').then(m => ({ default: m.RecruiterATSTemplate })));
export const LazyFullStack = safeLazy(() => import('./FullStack/FullStackTemplate').then(m => ({ default: m.FullStackTemplate })));

// ──────────────────────────────────────────
// Reactive Templates (Lazy Loaded)
// ──────────────────────────────────────────
export const LazyCreativeSidebar = safeLazy(() => import('./reactive/CreativeSidebar').then(m => ({ default: m.CreativeSidebarTemplate })));
export const LazyProfessionalClean = safeLazy(() => import('./reactive/ProfessionalClean').then(m => ({ default: m.ProfessionalCleanTemplate })));
export const LazyMarketingAccent = safeLazy(() => import('./reactive/MarketingAccent').then(m => ({ default: m.MarketingAccentTemplate })));
export const LazyDeveloperDark = safeLazy(() => import('./reactive/DeveloperDark').then(m => ({ default: m.DeveloperDarkTemplate })));
export const LazyATSClassic = safeLazy(() => import('./reactive/ATSClassic').then(m => ({ default: m.ATSClassicTemplate })));
export const LazyBusinessAnalyst = safeLazy(() => import('./reactive/BusinessAnalyst').then(m => ({ default: m.BusinessAnalystTemplate })));
export const LazyExecutiveMinimal = safeLazy(() => import('./reactive/ExecutiveMinimal').then(m => ({ default: m.ExecutiveMinimalTemplate })));
export const LazyCompactEntry = safeLazy(() => import('./reactive/CompactEntry').then(m => ({ default: m.CompactEntryTemplate })));
export const LazySeniorEnterprise = safeLazy(() => import('./reactive/SeniorEnterprise').then(m => ({ default: m.SeniorEnterpriseTemplate })));
export const LazyHealthcareCalm = safeLazy(() => import('./reactive/HealthcareCalm').then(m => ({ default: m.HealthcareCalmTemplate })));
export const LazyAsiaCompact = safeLazy(() => import('./reactive/AsiaCompact').then(m => ({ default: m.AsiaCompactTemplate })));
export const LazyTechnicalGrid = safeLazy(() => import('./reactive/TechnicalGrid').then(m => ({ default: m.TechnicalGridTemplate })));
export const LazyAccentColumn = safeLazy(() => import('./reactive/AccentColumn').then(m => ({ default: m.AccentColumnTemplate })));
export const LazyWhitespaceModern = safeLazy(() => import('./reactive/WhitespaceModern').then(m => ({ default: m.WhitespaceModernTemplate })));
export const LazyExecutiveBold = safeLazy(() => import('./reactive/ExecutiveBold').then(m => ({ default: m.ExecutiveBoldTemplate })));

// ──────────────────────────────────────────
// Best-Resume-Ever Templates (Lazy Loaded)
// ──────────────────────────────────────────
export const LazyBRECool = safeLazy(() => import('./bre-cool/Template').then(m => ({ default: m.BRECoolTemplate })));
export const LazyBRECreative = safeLazy(() => import('./bre-creative/Template').then(m => ({ default: m.BRECreativeTemplate })));
export const LazyBREGreen = safeLazy(() => import('./bre-green/Template').then(m => ({ default: m.BREGreenTemplate })));
export const LazyBRELeftRight = safeLazy(() => import('./bre-left-right/Template').then(m => ({ default: m.BRELeftRightTemplate })));
export const LazyBREMaterialDark = safeLazy(() => import('./bre-material-dark/Template').then(m => ({ default: m.BREMaterialDarkTemplate })));
export const LazyBREOblique = safeLazy(() => import('./bre-oblique/Template').then(m => ({ default: m.BREObliqueTemplate })));
export const LazyBREPurple = safeLazy(() => import('./bre-purple/Template').then(m => ({ default: m.BREPurpleTemplate })));
export const LazyBRESidebar = safeLazy(() => import('./bre-sidebar/Template').then(m => ({ default: m.BRESidebarTemplate })));

// ──────────────────────────────────────────
// JSONResume Theme Modern (Lazy Loaded)
// ──────────────────────────────────────────
export const LazyJSONResumeModern = safeLazy(() => import('./jsonresume-modern/Template').then(m => ({ default: m.JSONResumeModernTemplate })));

// ──────────────────────────────────────────
// Flat Template Registry (ID → Lazy Component)
// ──────────────────────────────────────────
export const TEMPLATE_REGISTRY = {
  // Core ATS
  modern: LazyModernATS,
  minimal: LazyMinimalATS,
  executive: LazyExecutiveATS,
  corporate: LazyCorporateATS,
  recruiter: LazyRecruiterATS,
  fullstack: LazyFullStack,
  frontend: LazyFullStack,
  backend: LazyFullStack,
  creative: LazyModernATS,
  // Best-Resume-Ever
  'bre-cool': LazyBRECool,
  'bre-creative': LazyBRECreative,
  'bre-green': LazyBREGreen,
  'bre-purple': LazyBREGreen, // Unified with BRE Accent Header
  'bre-left-right': LazyBRELeftRight,
  'bre-material-dark': LazyBREMaterialDark,
  'bre-oblique': LazyBREOblique,
  'bre-sidebar': LazyBRESidebar,
  // JSONResume Modern
  'jsonresume-modern': LazyJSONResumeModern,
  // Reactive Resume
  'creative-sidebar': LazyCreativeSidebar,
  'professional-clean': LazyProfessionalClean,
  'marketing-accent': LazyMarketingAccent,
  'developer-dark': LazyDeveloperDark,
  'ats-classic': LazyATSClassic,
  'business-analyst': LazyBusinessAnalyst,
  'executive-minimal': LazyExecutiveMinimal,
  'compact-entry': LazyCompactEntry,
  'senior-enterprise': LazySeniorEnterprise,
  'healthcare-calm': LazyHealthcareCalm,
  'asia-compact': LazyAsiaCompact,
  'technical-grid': LazyTechnicalGrid,
  'accent-column': LazyAccentColumn,
  'whitespace-modern': LazyWhitespaceModern,
  'executive-bold': LazyExecutiveBold
};

/**
 * Builds template card entries enriched with full capability schemas and component references.
 */
const buildTemplateCard = (id) => {
  const caps = getTemplateCapabilities(id);
  return {
    ...caps,
    component: TEMPLATE_REGISTRY[id] || LazyModernATS,
    previewImage: `/templates/${id}.jpg`
  };
};

// ──────────────────────────────────────────
// OpportunityX Industry Categories
// ──────────────────────────────────────────
export const TEMPLATE_CATEGORIES = [
  {
    id: 'ats',
    categoryName: 'ATS Optimized Core Layouts',
    shortName: 'ATS Core',
    templates: ['modern', 'minimal', 'executive', 'corporate', 'recruiter', 'fullstack', 'ats-classic', 'asia-compact'].map(buildTemplateCard)
  },
  {
    id: 'tech',
    categoryName: 'Software & Technology Layouts',
    shortName: 'Software & Tech',
    templates: ['fullstack', 'developer-dark', 'technical-grid', 'bre-material-dark'].map(buildTemplateCard)
  },
  {
    id: 'creative',
    categoryName: 'Creative & Visual Sidebar Layouts',
    shortName: 'Creative & Visual',
    templates: ['creative-sidebar', 'marketing-accent', 'accent-column', 'whitespace-modern', 'bre-cool', 'bre-creative', 'bre-left-right', 'bre-oblique'].map(buildTemplateCard)
  },
  {
    id: 'executive',
    categoryName: 'Executive & Management Layouts',
    shortName: 'Executive',
    templates: ['executive', 'executive-minimal', 'senior-enterprise', 'executive-bold'].map(buildTemplateCard)
  },
  {
    id: 'business',
    categoryName: 'Business, Consulting & Finance',
    shortName: 'Business & Finance',
    templates: ['corporate', 'business-analyst', 'bre-sidebar'].map(buildTemplateCard)
  },
  {
    id: 'student',
    categoryName: 'Student & Entry Level Layouts',
    shortName: 'Student & Entry',
    templates: ['compact-entry', 'minimal', 'recruiter'].map(buildTemplateCard)
  },
  {
    id: 'academic',
    categoryName: 'Academic, Research & Healthcare',
    shortName: 'Academic & Healthcare',
    templates: ['healthcare-calm', 'jsonresume-modern', 'bre-green'].map(buildTemplateCard)
  }
];
