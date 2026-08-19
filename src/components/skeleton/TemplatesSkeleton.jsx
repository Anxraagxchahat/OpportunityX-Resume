import React from 'react';
import { Skeleton, SkeletonText, SkeletonButton } from './Skeleton';

export const TemplatesSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--ox-bg)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* ─── Header Skeleton ─── */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 mx-auto">
          <Skeleton variant="rectangular" width={110} height={24} className="rounded-full bg-orange-500/20" />
        </div>
        <Skeleton variant="text" width="60%" height={32} className="mx-auto rounded-lg" />
        <Skeleton variant="text" width="80%" height={14} className="mx-auto opacity-60" />
      </div>

      {/* ─── Category Tabs Skeleton ─── */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['All (22)', 'ATS Friendly', 'Executive', 'Modern', 'Technical', 'Creative'].map((_, idx) => (
          <Skeleton
            key={idx}
            variant="rectangular"
            width={idx === 0 ? 80 : 100}
            height={38}
            className={`rounded-xl flex-shrink-0 ${idx === 0 ? 'bg-orange-500/20' : ''}`}
          />
        ))}
      </div>

      {/* ─── Filter & Search Bar ─── */}
      <div className="p-4 rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <Skeleton variant="rectangular" height={40} className="w-full sm:w-80 rounded-xl" />
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Skeleton variant="rectangular" width={100} height={36} className="rounded-xl" />
          <Skeleton variant="rectangular" width={110} height={36} className="rounded-xl" />
        </div>
      </div>

      {/* ─── Template Cards Grid Skeleton (6 cards) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] p-4 space-y-4 flex flex-col justify-between overflow-hidden"
          >
            {/* Template A4 Thumbnail Preview Placeholder */}
            <div className="aspect-[1/1.35] w-full rounded-xl bg-[var(--ox-surface-secondary)] p-4 flex flex-col justify-between border border-[var(--ox-border)]/60 relative overflow-hidden">
              <div className="space-y-3">
                <div className="border-b border-[var(--ox-border)] pb-2 space-y-1.5">
                  <Skeleton variant="text" width="55%" height={12} className="bg-orange-500/20" />
                  <Skeleton variant="text" width="35%" height={8} />
                </div>
                <div className="space-y-1">
                  <Skeleton variant="text" width="25%" height={8} />
                  <SkeletonText lines={2} lastLineWidth="80%" />
                </div>
                <div className="space-y-1 pt-1">
                  <Skeleton variant="text" width="30%" height={8} />
                  <SkeletonText lines={2} lastLineWidth="65%" />
                </div>
              </div>
              <div className="pt-2 border-t border-[var(--ox-border)] flex justify-between items-center opacity-40">
                <Skeleton variant="text" width={50} height={6} />
                <Skeleton variant="text" width={24} height={6} />
              </div>
            </div>

            {/* Template Card Meta & Actions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton variant="text" width="50%" height={16} className="rounded-md" />
                <Skeleton variant="rectangular" width={60} height={18} className="rounded-full bg-emerald-500/10" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton variant="rectangular" width={64} height={20} className="rounded-md" />
                <Skeleton variant="rectangular" width={72} height={20} className="rounded-md" />
              </div>
              <SkeletonButton width="100%" height={40} className="w-full bg-orange-500/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesSkeleton;
