import React from 'react';
import { Skeleton, SkeletonText, SkeletonButton, SkeletonAvatar } from './Skeleton';

export const FounderSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--ox-bg)] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 select-none">
      {/* Hero Profile Banner */}
      <div className="p-8 sm:p-10 rounded-3xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
        <Skeleton variant="circular" width={110} height={110} className="border-4 border-orange-500/20" />
        <div className="space-y-3 flex-1">
          <Skeleton variant="rectangular" width={120} height={24} className="rounded-full bg-orange-500/20 mx-auto sm:mx-0" />
          <Skeleton variant="text" width={220} height={28} className="rounded-lg mx-auto sm:mx-0" />
          <Skeleton variant="text" width={180} height={16} className="opacity-70 mx-auto sm:mx-0" />
          <div className="flex gap-2.5 pt-2 justify-center sm:justify-start">
            <Skeleton variant="rectangular" width={36} height={36} className="rounded-xl" />
            <Skeleton variant="rectangular" width={36} height={36} className="rounded-xl" />
            <Skeleton variant="rectangular" width={36} height={36} className="rounded-xl" />
          </div>
        </div>
      </div>

      {/* Story Sections */}
      <div className="space-y-6">
        <div className="p-6 rounded-3xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-4">
          <Skeleton variant="text" width={180} height={22} />
          <SkeletonText lines={4} lastLineWidth="85%" />
          <SkeletonText lines={3} lastLineWidth="60%" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-3">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width={140} height={18} />
            <SkeletonText lines={3} />
          </div>
          <div className="p-6 rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-3">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width={140} height={18} />
            <SkeletonText lines={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderSkeleton;
