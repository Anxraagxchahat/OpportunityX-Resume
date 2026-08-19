import React from 'react';
import { Skeleton, SkeletonText, SkeletonButton } from './Skeleton';

export const AIAssistantSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--ox-bg)] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 select-none">
      {/* ─── Header Skeleton ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--ox-border)] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton variant="rectangular" width={140} height={24} className="rounded-full bg-orange-500/20" />
            <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
          </div>
          <Skeleton variant="text" width={260} height={28} className="rounded-lg" />
          <Skeleton variant="text" width={380} height={14} className="opacity-60" />
        </div>

        <div className="flex items-center gap-3">
          <SkeletonButton width={110} height={40} />
          <SkeletonButton width={130} height={40} className="bg-orange-500/20" />
        </div>
      </div>

      {/* ─── Feature Pills Grid Skeleton ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['Summary Generator', 'Bullet Points AI', 'Cover Letter AI', 'Skills Extractor'].map((_, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border border-[var(--ox-border)] flex items-center gap-3 ${
              idx === 0 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-[var(--ox-surface-primary)]'
            }`}
          >
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="text" width="65%" height={14} />
          </div>
        ))}
      </div>

      {/* ─── Main Execution Box Skeleton ─── */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-6">
        {/* Model Selector & Cost Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)]/60">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="space-y-1.5">
              <Skeleton variant="text" width={60} height={10} className="opacity-60" />
              <Skeleton variant="text" width={90} height={16} className="rounded-md" />
            </div>
          ))}
        </div>

        {/* Input Prompt Skeleton */}
        <div className="space-y-2">
          <Skeleton variant="text" width={140} height={12} />
          <Skeleton variant="rectangular" height={100} className="w-full rounded-2xl" />
        </div>

        {/* Run Button Skeleton */}
        <SkeletonButton width={220} height={46} className="bg-orange-500/20" />

        {/* Simulated Shimmering AI Response Card */}
        <div className="p-6 rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-secondary)]/50 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--ox-border)] pb-3">
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width={150} height={14} />
            </div>
            <Skeleton variant="rectangular" width={60} height={20} className="rounded-md" />
          </div>
          <SkeletonText lines={4} lastLineWidth="70%" />
        </div>
      </div>
    </div>
  );
};

export default AIAssistantSkeleton;
