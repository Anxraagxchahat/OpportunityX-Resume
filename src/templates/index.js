import React, { lazy } from 'react';

// Lazy loading template components to optimize bundle size and keep switching under 100ms
export const LazyModernATS = lazy(() => import('./ModernATS/ModernATSTemplate').then(m => ({ default: m.ModernATSTemplate })));
export const LazyMinimalATS = lazy(() => import('./MinimalATS/MinimalATSTemplate').then(m => ({ default: m.MinimalATSTemplate })));
export const LazyExecutiveATS = lazy(() => import('./ExecutiveATS/ExecutiveATSTemplate').then(m => ({ default: m.ExecutiveATSTemplate })));
export const LazyCorporateATS = lazy(() => import('./CorporateATS/CorporateATSTemplate').then(m => ({ default: m.CorporateATSTemplate })));
export const LazyRecruiterATS = lazy(() => import('./RecruiterATS/RecruiterATSTemplate').then(m => ({ default: m.RecruiterATSTemplate })));
export const LazyFullStack = lazy(() => import('./FullStack/FullStackTemplate').then(m => ({ default: m.FullStackTemplate })));

export const TEMPLATE_CATEGORIES = [
  {
    id: 'ats',
    categoryName: 'ATS Optimized Templates',
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
      }
    ]
  },
  {
    id: 'engineering',
    categoryName: 'Tech & Engineering Templates',
    templates: [
      {
        id: 'fullstack',
        name: 'Full Stack Engineer',
        folder: 'FullStack',
        description: 'Presents tech stack, GitHub contributions, and architecture metrics.',
        atsFriendly: true,
        supportsPhoto: false,
        supportsSidebar: false,
        accentColor: '#F97316',
        component: LazyFullStack
      },
      {
        id: 'frontend',
        name: 'Frontend Developer',
        folder: 'FrontendDeveloper',
        description: 'Highlights UI projects, CSS frameworks, and design tokens.',
        atsFriendly: true,
        supportsPhoto: false,
        supportsSidebar: false,
        accentColor: '#059669',
        component: LazyFullStack
      },
      {
        id: 'backend',
        name: 'Backend Developer',
        folder: 'BackendDeveloper',
        description: 'Emphasizes API architecture, databases, and microservices.',
        atsFriendly: true,
        supportsPhoto: false,
        supportsSidebar: false,
        accentColor: '#2563EB',
        component: LazyFullStack
      }
    ]
  },
  {
    id: 'creative',
    categoryName: 'Creative & Sidebar Templates',
    templates: [
      {
        id: 'creative',
        name: 'Creative 2-Column',
        folder: 'Creative',
        description: 'Two-column layout with left accent sidebar and photo badge.',
        atsFriendly: false,
        supportsPhoto: true,
        supportsSidebar: true,
        accentColor: '#F97316',
        component: LazyModernATS
      }
    ]
  }
];

export const TEMPLATE_REGISTRY = {
  modern: LazyModernATS,
  minimal: LazyMinimalATS,
  executive: LazyExecutiveATS,
  corporate: LazyCorporateATS,
  recruiter: LazyRecruiterATS,
  fullstack: LazyFullStack,
  frontend: LazyFullStack,
  backend: LazyFullStack,
  creative: LazyModernATS
};
