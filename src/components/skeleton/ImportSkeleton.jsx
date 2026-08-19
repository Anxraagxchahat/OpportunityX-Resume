import React from 'react';
import { Skeleton, SkeletonText, SkeletonButton } from './Skeleton';

export const ImportSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--ox-bg)] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 select-none">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <Skeleton variant="rectangular" width={100} height={24} className="rounded-full mx-auto bg-orange-500/20" />
        <Skeleton variant="text" width="70%" height={32} className="mx-auto rounded-lg" />
        <Skeleton variant="text" width="85%" height={14} className="mx-auto opacity-60" />
      </div>

      {/* Stepper Tabs */}
      <div className="flex items-center justify-center gap-3">
        {['1. Upload File', '2. AI Parse & Review', '3. Export to Builder'].map((_, idx) => (
          <Skeleton
            key={idx}
            variant="rectangular"
            width={140}
            height={36}
            className={`rounded-xl ${idx === 0 ? 'bg-orange-500/20' : ''}`}
          />
        ))}
      </div>

      {/* Dropzone Skeleton */}
      <div className="p-10 rounded-3xl border-2 border-dashed border-[var(--ox-border)] bg-[var(--ox-surface-primary)] flex flex-col items-center justify-center text-center space-y-4 min-h-[280px]">
        <Skeleton variant="circular" width={64} height={64} className="bg-orange-500/10" />
        <div className="space-y-2">
          <Skeleton variant="text" width={220} height={20} className="mx-auto rounded-md" />
          <Skeleton variant="text" width={160} height={12} className="mx-auto opacity-60" />
        </div>
        <SkeletonButton width={160} height={44} className="bg-orange-500/20" />
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="p-4 rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-2">
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="text" width="60%" height={14} />
            <SkeletonText lines={2} lastLineWidth="90%" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImportSkeleton;
