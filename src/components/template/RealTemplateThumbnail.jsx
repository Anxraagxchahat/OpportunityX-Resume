import React, { useState } from 'react';
import { getTemplatePreviewAsset } from '../../assets/templatePreviews';

export const RealTemplateThumbnail = ({ template, type = 'thumbnail' }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { supportsSidebar, accentColor = '#F97316' } = template || {};
  const previewSrc = getTemplatePreviewAsset(template?.id, type);

  // Fallback schematic wireframe if image fails or is missing
  if (hasError || !previewSrc) {
    if (supportsSidebar) {
      return (
        <div className="w-full h-full bg-[var(--ox-surface-secondary)] rounded border border-[var(--ox-border)] overflow-hidden flex text-[6px]">
          {/* Left Sidebar */}
          <div className="w-[35%] p-1.5 space-y-1 text-white flex flex-col justify-between" style={{ backgroundColor: accentColor }}>
            <div className="space-y-1">
              <div className="w-5 h-5 rounded-full bg-white/40 mx-auto" />
              <div className="h-1.5 w-full bg-white/80 rounded" />
              <div className="h-1 w-3/4 bg-white/70 rounded" />
            </div>
            <div className="space-y-0.5 pb-1">
              <div className="h-1 w-full bg-white/50 rounded" />
              <div className="h-1 w-5/6 bg-white/50 rounded" />
            </div>
          </div>

          {/* Right Main Body */}
          <div className="w-[65%] p-2 space-y-1.5 bg-[var(--ox-card-bg)] text-[var(--ox-text-primary)]">
            <div className="h-1.5 w-1/2 rounded" style={{ backgroundColor: accentColor }} />
            <div className="h-1 w-full bg-[var(--ox-border)] rounded" />
            <div className="h-1 w-5/6 bg-[var(--ox-border)] rounded" />
            <div className="pt-1 space-y-1">
              <div className="h-1 w-1/3 bg-[var(--ox-text-secondary)] rounded font-bold" />
              <div className="h-1 w-full bg-[var(--ox-surface-secondary)] rounded" />
              <div className="h-1 w-4/5 bg-[var(--ox-surface-secondary)] rounded" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-[var(--ox-card-bg)] rounded border border-[var(--ox-border)] p-2 space-y-1.5 text-[6px] text-[var(--ox-text-primary)] flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Top Header */}
          <div className="border-b pb-1 space-y-0.5" style={{ borderColor: accentColor }}>
            <div className="h-2 w-1/2 rounded" style={{ backgroundColor: accentColor }} />
            <div className="h-1 w-1/3 bg-[var(--ox-text-secondary)] rounded" />
            <div className="h-0.5 w-full bg-[var(--ox-border)] rounded" />
          </div>

          {/* Body Lines */}
          <div className="space-y-1 pt-0.5">
            <div className="h-1 w-1/4 rounded font-bold" style={{ backgroundColor: `${accentColor}80` }} />
            <div className="h-1 w-full bg-[var(--ox-surface-secondary)] rounded" />
            <div className="h-1 w-5/6 bg-[var(--ox-surface-secondary)] rounded" />
          </div>
        </div>

        <div className="text-[8px] text-[var(--ox-text-muted)] font-bold text-center pb-0.5">
          OpportunityX {template?.name || 'Template'}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded border border-[var(--ox-border)] overflow-hidden relative bg-[var(--ox-surface-secondary)]">
      {isLoading && (
        <div className="absolute inset-0 bg-[var(--ox-surface-primary)] animate-pulse flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={previewSrc}
        alt={`${template?.name || 'Template'} preview`}
        className={`w-full h-full object-cover object-top transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
