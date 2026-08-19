import React from 'react';
import { Skeleton, SkeletonText } from './Skeleton';

export const LegalSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--ox-bg)] py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto select-none">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Sidebar Table of Contents */}
        <div className="md:col-span-4 space-y-3">
          <Skeleton variant="text" width="60%" height={16} className="mb-4" />
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border border-[var(--ox-border)] ${
                idx === 0 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-[var(--ox-surface-primary)]'
              }`}
            >
              <Skeleton variant="text" width={idx % 2 === 0 ? '80%' : '65%'} height={14} />
            </div>
          ))}
        </div>

        {/* Right Legal Document Body */}
        <div className="md:col-span-8 p-6 sm:p-8 rounded-3xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-6">
          <div className="border-b border-[var(--ox-border)] pb-4 space-y-2">
            <Skeleton variant="rectangular" width={100} height={22} className="rounded-full bg-orange-500/20" />
            <Skeleton variant="text" width="75%" height={26} className="rounded-lg" />
            <Skeleton variant="text" width="40%" height={12} className="opacity-50" />
          </div>

          <div className="space-y-4">
            <SkeletonText lines={4} lastLineWidth="85%" />
            <Skeleton variant="text" width="50%" height={18} className="pt-2" />
            <SkeletonText lines={3} lastLineWidth="70%" />
            <Skeleton variant="text" width="45%" height={18} className="pt-2" />
            <SkeletonText lines={4} lastLineWidth="90%" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalSkeleton;
