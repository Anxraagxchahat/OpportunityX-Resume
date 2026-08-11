import React, { lazy } from 'react';
import { getTemplateCapabilities, OPPORTUNITYX_TEMPLATES_METADATA } from '../utils/templateCapabilities';

export { getTemplateCapabilities, OPPORTUNITYX_TEMPLATES_METADATA };

// ──────────────────────────────────────────
// OpportunityX Core Templates (Lazy Loaded)
// ──────────────────────────────────────────
export const LazyModernATS = lazy(() => import('./ModernATS/ModernATSTemplate').then(m => ({ default: m.ModernATSTemplate })));
export const LazyMinimalATS = lazy(() => import('./MinimalATS/MinimalATSTemplate').then(m => ({ default: m.MinimalATSTemplate })));
export const LazyExecutiveATS = lazy(() => import('./ExecutiveATS/ExecutiveATSTemplate').then(m => ({ default: m.ExecutiveATSTemplate })));
export const LazyCorporateATS = lazy(() => import('./CorporateATS/CorporateATSTemplate').then(m => ({ default: m.CorporateATSTemplate })));
export const LazyRecruiterATS = lazy(() => import('./RecruiterATS/RecruiterATSTemplate').then(m => ({ default: m.RecruiterATSTemplate })));
export const LazyFullStack = lazy(() => import('./FullStack/FullStackTemplate').then(m => ({ default: m.FullStackTemplate })));

// ──────────────────────────────────────────
// Reactive Templates (Lazy Loaded)
// ──────────────────────────────────────────
export const LazyCreativeSidebar = lazy(() => import('./reactive/CreativeSidebar').then(m => ({ default: m.CreativeSidebarTemplate })));
export const LazyProfessionalClean = lazy(() => import('./reactive/ProfessionalClean').then(m => ({ default: m.ProfessionalCleanTemplate })));
export const LazyMarketingAccent = lazy(() => import('./reactive/MarketingAccent').then(m => ({ default: m.MarketingAccentTemplate })));
export const LazyDeveloperDark = lazy(() => import('./reactive/DeveloperDark').then(m => ({ default: m.DeveloperDarkTemplate })));
export const LazyATSClassic = lazy(() => import('./reactive/ATSClassic').then(m => ({ default: m.ATSClassicTemplate })));
export const LazyBusinessAnalyst = lazy(() => import('./reactive/BusinessAnalyst').then(m => ({ default: m.BusinessAnalystTemplate })));
export const LazyExecutiveMinimal = lazy(() => import('./reactive/ExecutiveMinimal').then(m => ({ default: m.ExecutiveMinimalTemplate })));
export const LazyCompactEntry = lazy(() => import('./reactive/CompactEntry').then(m => ({ default: m.CompactEntryTemplate })));
export const LazySeniorEnterprise = lazy(() => import('./reactive/SeniorEnterprise').then(m => ({ default: m.SeniorEnterpriseTemplate })));
export const LazyHealthcareCalm = lazy(() => import('./reactive/HealthcareCalm').then(m => ({ default: m.HealthcareCalmTemplate })));
export const LazyAsiaCompact = lazy(() => import('./reactive/AsiaCompact').then(m => ({ default: m.AsiaCompactTemplate })));
export const LazyTechnicalGrid = lazy(() => import('./reactive/TechnicalGrid').then(m => ({ default: m.TechnicalGridTemplate })));
export const LazyAccentColumn = lazy(() => import('./reactive/AccentColumn').then(m => ({ default: m.AccentColumnTemplate })));
export const LazyWhitespaceModern = lazy(() => import('./reactive/WhitespaceModern').then(m => ({ default: m.WhitespaceModernTemplate })));
export const LazyExecutiveBold = lazy(() => import('./reactive/ExecutiveBold').then(m => ({ default: m.ExecutiveBoldTemplate })));

// ──────────────────────────────────────────
// Best-Resume-Ever Templates (Lazy Loaded)
// ──────────────────────────────────────────
export const LazyBRECool = lazy(() => import('./bre-cool/Template').then(m => ({ default: m.BRECoolTemplate })));
export const LazyBRECreative = lazy(() => import('./bre-creative/Template').then(m => ({ default: m.BRECreativeTemplate })));
export const LazyBREGreen = lazy(() => import('./bre-green/Template').then(m => ({ default: m.BREGreenTemplate })));
export const LazyBRELeftRight = lazy(() => import('./bre-left-right/Template').then(m => ({ default: m.BRELeftRightTemplate })));
export const LazyBREMaterialDark = lazy(() => import('./bre-material-dark/Template').then(m => ({ default: m.BREMaterialDarkTemplate })));
export const LazyBREOblique = lazy(() => import('./bre-oblique/Template').then(m => ({ default: m.BREObliqueTemplate })));
export const LazyBREPurple = lazy(() => import('./bre-purple/Template').then(m => ({ default: m.BREPurpleTemplate })));
export const LazyBRESidebar = lazy(() => import('./bre-sidebar/Template').then(m => ({ default: m.BRESidebarTemplate })));

// ──────────────────────────────────────────
// JSONResume Theme Modern (Lazy Loaded)
// ──────────────────────────────────────────
export const LazyJSONResumeModern = lazy(() => import('./jsonresume-modern/Template').then(m => ({ default: m.JSONResumeModernTemplate })));

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
