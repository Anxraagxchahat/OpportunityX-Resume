import React from 'react';
import { Skeleton, SkeletonText, SkeletonButton } from './Skeleton';

export const EcosystemSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--ox-bg)] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 select-none">
      {/* Hero Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Skeleton variant="rectangular" width={130} height={24} className="rounded-full mx-auto bg-orange-500/20" />
        <Skeleton variant="text" width="75%" height={32} className="mx-auto rounded-lg" />
        <Skeleton variant="text" width="90%" height={14} className="mx-auto opacity-60" />
      </div>

      {/* Grid of Interconnected Apps (6 items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton variant="circular" width={44} height={44} />
                <Skeleton variant="rectangular" width={60} height={20} className="rounded-full" />
              </div>
              <Skeleton variant="text" width="60%" height={20} className="rounded-md" />
              <SkeletonText lines={2} lastLineWidth="80%" />
            </div>
            <div className="pt-2 border-t border-[var(--ox-border)] flex justify-between items-center">
              <Skeleton variant="text" width={80} height={12} />
              <Skeleton variant="rectangular" width={28} height={28} className="rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EcosystemSkeleton;
