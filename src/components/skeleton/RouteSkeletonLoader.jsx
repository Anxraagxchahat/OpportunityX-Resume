import React from 'react';
import { useLocation } from 'react-router-dom';
import { BuilderSkeleton } from './BuilderSkeleton';
import { DashboardSkeleton } from './DashboardSkeleton';
import { TemplatesSkeleton } from './TemplatesSkeleton';
import { ATSCheckerSkeleton } from './ATSCheckerSkeleton';
import { AIAssistantSkeleton } from './AIAssistantSkeleton';
import { EcosystemSkeleton } from './EcosystemSkeleton';
import { ImportSkeleton } from './ImportSkeleton';
import { FounderSkeleton } from './FounderSkeleton';
import { LegalSkeleton } from './LegalSkeleton';
import { LandingSkeleton } from './LandingSkeleton';

/**
 * OpportunityX — Route-Aware Intelligent Skeleton Loader
 * Detects current pathname and renders exact contextual skeleton UI.
 */
export const RouteSkeletonLoader = () => {
  let pathname = '/';
  try {
    const loc = useLocation();
    pathname = loc.pathname || '/';
  } catch (e) {
    if (typeof window !== 'undefined') {
      pathname = window.location.pathname || '/';
    }
  }

  const getRouteInfo = () => {
    if (pathname.startsWith('/builder')) {
      return { Component: BuilderSkeleton, label: 'Resume Builder Workspace' };
    }
    if (pathname.startsWith('/dashboard')) {
      return { Component: DashboardSkeleton, label: 'Candidate Dashboard' };
    }
    if (pathname.startsWith('/templates')) {
      return { Component: TemplatesSkeleton, label: 'Template Gallery' };
    }
    if (pathname.startsWith('/ats-checker')) {
      return { Component: ATSCheckerSkeleton, label: 'ATS Scanner Engine' };
    }
    if (pathname.startsWith('/ai-assistant')) {
      return { Component: AIAssistantSkeleton, label: 'AI Career Assistant' };
    }
    if (pathname.startsWith('/ecosystem')) {
      return { Component: EcosystemSkeleton, label: 'Ecosystem Hub' };
    }
    if (pathname.startsWith('/import')) {
      return { Component: ImportSkeleton, label: 'Resume Import Wizard' };
    }
    if (pathname.startsWith('/founder') || pathname.startsWith('/meet-the-founder')) {
      return { Component: FounderSkeleton, label: 'Meet The Founder' };
    }
    if (pathname.startsWith('/legal')) {
      return { Component: LegalSkeleton, label: 'Legal & Privacy Center' };
    }
    return { Component: LandingSkeleton, label: 'OpportunityX Platform' };
  };

  const { Component, label } = getRouteInfo();

  return (
    <div className="relative w-full flex-1 flex flex-col min-h-[70vh]">
      {/* Route Skeleton Layout */}
      <Component />

      {/* Floating Branded Status Pill (Non-intrusive bottom badge) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--ox-surface-primary)]/90 backdrop-blur-md border border-[var(--ox-border)] shadow-xl text-xs font-semibold text-[var(--ox-text-secondary)] pointer-events-none transition-all duration-300">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
        </span>
        <span>Loading <strong className="text-[var(--ox-text-primary)] font-bold">{label}</strong>...</span>
      </div>
    </div>
  );
};

export default RouteSkeletonLoader;
