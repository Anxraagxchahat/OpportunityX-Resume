import React, { lazy } from 'react';
import { REACTIVE_TEMPLATE_METADATA } from './reactive/metadata';
import { metadata as breCoolMeta } from './bre-cool/metadata';
import { metadata as breCreativeMeta } from './bre-creative/metadata';
import { metadata as breGreenMeta } from './bre-green/metadata';
import { metadata as breLeftRightMeta } from './bre-left-right/metadata';
import { metadata as breMaterialDarkMeta } from './bre-material-dark/metadata';
import { metadata as breObliqueMeta } from './bre-oblique/metadata';
import { metadata as brePurpleMeta } from './bre-purple/metadata';
import { metadata as breSidebarMeta } from './bre-sidebar/metadata';
import { metadata as jsonresumeModernMeta } from './jsonresume-modern/metadata';

// ──────────────────────────────────────────
// Original OpportunityX Core Templates (Lazy)
// ──────────────────────────────────────────
export const LazyModernATS = lazy(() => import('./ModernATS/ModernATSTemplate').then(m => ({ default: m.ModernATSTemplate })));
export const LazyMinimalATS = lazy(() => import('./MinimalATS/MinimalATSTemplate').then(m => ({ default: m.MinimalATSTemplate })));
export const LazyExecutiveATS = lazy(() => import('./ExecutiveATS/ExecutiveATSTemplate').then(m => ({ default: m.ExecutiveATSTemplate })));
export const LazyCorporateATS = lazy(() => import('./CorporateATS/CorporateATSTemplate').then(m => ({ default: m.CorporateATSTemplate })));
export const LazyRecruiterATS = lazy(() => import('./RecruiterATS/RecruiterATSTemplate').then(m => ({ default: m.RecruiterATSTemplate })));
export const LazyFullStack = lazy(() => import('./FullStack/FullStackTemplate').then(m => ({ default: m.FullStackTemplate })));

// ──────────────────────────────────────────
// Reactive Resume Templates (Lazy)
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
// Best-Resume-Ever Templates (Lazy)
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
// JSONResume Theme Modern (Lazy)
// ──────────────────────────────────────────
export const LazyJSONResumeModern = lazy(() => import('./jsonresume-modern/Template').then(m => ({ default: m.JSONResumeModernTemplate })));

// ──────────────────────────────────────────
// Reactive Template ID → Component Map
// ──────────────────────────────────────────
const REACTIVE_COMPONENT_MAP = {
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
  'executive-bold': LazyExecutiveBold,
};

// ──────────────────────────────────────────
// Template Marketplace Categories
// ──────────────────────────────────────────
export const TEMPLATE_CATEGORIES = [
  {
    id: 'ats',
    categoryName: 'ATS Optimized Core Templates',
    templates: [
      {
        id: 'modern',
        name: 'Modern ATS',
        folder: 'ModernATS',
        description: 'Single-column high-contrast layout optimized for 100% ATS parser pass rates.',
        atsFriendly: true,
        supportsPhoto: false,
        supportsSidebar: false,
        accentColor: '#F97316',
        component: LazyModernATS
      },
      {
        id: 'minimal',
        name: 'Minimal ATS',
        folder: 'MinimalATS',
        description: 'Clean minimalist layout suited for legal, finance, and traditional applications.',
        atsFriendly: true,
        supportsPhoto: false,
        supportsSidebar: false,
        accentColor: '#2563EB',
        component: LazyMinimalATS
      },
      {
        id: 'executive',
        name: 'Executive ATS',
        folder: 'ExecutiveATS',
        description: 'Double-bordered executive layout tailored for leadership & management roles.',
        atsFriendly: true,
        supportsPhoto: false,
        supportsSidebar: false,
        accentColor: '#7C3AED',
        component: LazyExecutiveATS
      },
      {
        id: 'corporate',
        name: 'Corporate ATS',
        folder: 'CorporateATS',
        description: 'Structured corporate layout designed for enterprise ATS applications.',
        atsFriendly: true,
        supportsPhoto: false,
        supportsSidebar: false,
        accentColor: '#059669',
        component: LazyCorporateATS
      },
      {
        id: 'recruiter',
        name: 'Recruiter Scan ATS',
        folder: 'RecruiterATS',
        description: 'Optimized for 6-second recruiter glance scanning.',
        atsFriendly: true,
        supportsPhoto: false,
        supportsSidebar: false,
        accentColor: '#DC2626',
        component: LazyRecruiterATS
      },
      {
        id: 'fullstack',
        name: 'Software & Tech Stack',
        folder: 'FullStack',
        description: 'Presents tech stack, GitHub contributions, and architecture metrics.',
        atsFriendly: true,
        supportsPhoto: false,
        supportsSidebar: false,
        accentColor: '#F97316',
        component: LazyFullStack
      },
      {
        id: breGreenMeta.id,
        name: breGreenMeta.name,
        folder: 'bre-green',
        description: breGreenMeta.description,
        atsFriendly: breGreenMeta.atsFriendly,
        supportsPhoto: breGreenMeta.supportsPhoto,
        supportsSidebar: breGreenMeta.supportsSidebar,
        accentColor: breGreenMeta.accentColor,
        component: LazyBREGreen
      },
      {
        id: brePurpleMeta.id,
        name: brePurpleMeta.name,
        folder: 'bre-purple',
        description: brePurpleMeta.description,
        atsFriendly: brePurpleMeta.atsFriendly,
        supportsPhoto: brePurpleMeta.supportsPhoto,
        supportsSidebar: brePurpleMeta.supportsSidebar,
        accentColor: brePurpleMeta.accentColor,
        component: LazyBREPurple
      },
      {
        id: jsonresumeModernMeta.id,
        name: jsonresumeModernMeta.name,
        folder: 'jsonresume-modern',
        description: jsonresumeModernMeta.description,
        atsFriendly: jsonresumeModernMeta.atsFriendly,
        supportsPhoto: jsonresumeModernMeta.supportsPhoto,
        supportsSidebar: jsonresumeModernMeta.supportsSidebar,
        accentColor: jsonresumeModernMeta.accentColor,
        component: LazyJSONResumeModern
      }
    ]
  },
  {
    id: 'best-resume-ever',
    categoryName: 'Best Resume Ever Layouts',
    templates: [
      {
        id: breCoolMeta.id,
        name: breCoolMeta.name,
        folder: 'bre-cool',
        description: breCoolMeta.description,
        atsFriendly: breCoolMeta.atsFriendly,
        supportsPhoto: breCoolMeta.supportsPhoto,
        supportsSidebar: breCoolMeta.supportsSidebar,
        accentColor: breCoolMeta.accentColor,
        component: LazyBRECool
      },
      {
        id: breCreativeMeta.id,
        name: breCreativeMeta.name,
        folder: 'bre-creative',
        description: breCreativeMeta.description,
        atsFriendly: breCreativeMeta.atsFriendly,
        supportsPhoto: breCreativeMeta.supportsPhoto,
        supportsSidebar: breCreativeMeta.supportsSidebar,
        accentColor: breCreativeMeta.accentColor,
        component: LazyBRECreative
      },
      {
        id: breLeftRightMeta.id,
        name: breLeftRightMeta.name,
        folder: 'bre-left-right',
        description: breLeftRightMeta.description,
        atsFriendly: breLeftRightMeta.atsFriendly,
        supportsPhoto: breLeftRightMeta.supportsPhoto,
        supportsSidebar: breLeftRightMeta.supportsSidebar,
        accentColor: breLeftRightMeta.accentColor,
        component: LazyBRELeftRight
      },
      {
        id: breMaterialDarkMeta.id,
        name: breMaterialDarkMeta.name,
        folder: 'bre-material-dark',
        description: breMaterialDarkMeta.description,
        atsFriendly: breMaterialDarkMeta.atsFriendly,
        supportsPhoto: breMaterialDarkMeta.supportsPhoto,
        supportsSidebar: breMaterialDarkMeta.supportsSidebar,
        accentColor: breMaterialDarkMeta.accentColor,
        component: LazyBREMaterialDark
      },
      {
        id: breObliqueMeta.id,
        name: breObliqueMeta.name,
        folder: 'bre-oblique',
        description: breObliqueMeta.description,
        atsFriendly: breObliqueMeta.atsFriendly,
        supportsPhoto: breObliqueMeta.supportsPhoto,
        supportsSidebar: breObliqueMeta.supportsSidebar,
        accentColor: breObliqueMeta.accentColor,
        component: LazyBREOblique
      },
      {
        id: breSidebarMeta.id,
        name: breSidebarMeta.name,
        folder: 'bre-sidebar',
        description: breSidebarMeta.description,
        atsFriendly: breSidebarMeta.atsFriendly,
        supportsPhoto: breSidebarMeta.supportsPhoto,
        supportsSidebar: breSidebarMeta.supportsSidebar,
        accentColor: breSidebarMeta.accentColor,
        component: LazyBRESidebar
      }
    ]
  },
  {
    id: 'premium-sidebar',
    categoryName: 'Premium Sidebar Layouts (Reactive)',
    templates: REACTIVE_TEMPLATE_METADATA
      .filter(t => t.supportsSidebar)
      .map(t => ({
        id: t.id,
        name: t.name,
        folder: `reactive`,
        description: t.description,
        atsFriendly: t.atsFriendly,
        supportsPhoto: t.supportsPhoto,
        supportsSidebar: t.supportsSidebar,
        accentColor: t.accentColor,
        previewImage: t.previewImage,
        component: REACTIVE_COMPONENT_MAP[t.id]
      }))
  },
  {
    id: 'premium-single',
    categoryName: 'Premium Single-Column Layouts (Reactive)',
    templates: REACTIVE_TEMPLATE_METADATA
      .filter(t => !t.supportsSidebar)
      .map(t => ({
        id: t.id,
        name: t.name,
        folder: `reactive`,
        description: t.description,
        atsFriendly: t.atsFriendly,
        supportsPhoto: t.supportsPhoto,
        supportsSidebar: t.supportsSidebar,
        accentColor: t.accentColor,
        previewImage: t.previewImage,
        component: REACTIVE_COMPONENT_MAP[t.id]
      }))
  }
];

// ──────────────────────────────────────────
// Flat Template Registry (ID → Component)
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
  'bre-left-right': LazyBRELeftRight,
  'bre-material-dark': LazyBREMaterialDark,
  'bre-oblique': LazyBREOblique,
  'bre-purple': LazyBREPurple,
  'bre-sidebar': LazyBRESidebar,
  // JSONResume Modern
  'jsonresume-modern': LazyJSONResumeModern,
  // Reactive Resume (Premium)
  ...REACTIVE_COMPONENT_MAP
};
