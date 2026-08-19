import React from 'react';
import { Skeleton, SkeletonText, SkeletonButton } from './Skeleton';

export const LandingSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--ox-bg)] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 select-none">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 mx-auto">
          <Skeleton variant="rectangular" width={220} height={28} className="rounded-full bg-orange-500/20" />
        </div>

        <div className="space-y-3">
          <Skeleton variant="text" width="85%" height={40} className="mx-auto rounded-xl" />
          <Skeleton variant="text" width="65%" height={32} className="mx-auto rounded-xl opacity-80" />
        </div>

        <Skeleton variant="text" width="75%" height={16} className="mx-auto opacity-60" />

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <SkeletonButton width={160} height={48} className="bg-orange-500/20" />
          <SkeletonButton width={140} height={48} />
        </div>
      </div>

      {/* Hero Mockup Preview Placeholder */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 rounded-3xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--ox-border)] pb-3">
          <div className="flex gap-1.5">
            <Skeleton variant="circular" width={12} height={12} />
            <Skeleton variant="circular" width={12} height={12} />
            <Skeleton variant="circular" width={12} height={12} />
          </div>
          <Skeleton variant="rectangular" width={140} height={20} className="rounded-full" />
          <Skeleton variant="rectangular" width={60} height={20} className="rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4">
          <div className="md:col-span-4 space-y-3">
            <Skeleton variant="circular" width={56} height={56} />
            <Skeleton variant="text" width="70%" height={16} />
            <SkeletonText lines={3} />
          </div>
          <div className="md:col-span-8 space-y-4">
            <Skeleton variant="text" width="40%" height={18} />
            <SkeletonText lines={4} lastLineWidth="80%" />
            <Skeleton variant="text" width="35%" height={18} />
            <SkeletonText lines={3} lastLineWidth="65%" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingSkeleton;
