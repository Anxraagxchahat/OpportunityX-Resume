import React from 'react';
import { Skeleton, SkeletonText, SkeletonButton, SkeletonAvatar } from './Skeleton';

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--ox-bg)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* ─── Hero Welcome Banner Skeleton ─── */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 max-w-xl z-10">
          <div className="flex items-center gap-2.5">
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="text" width={140} height={16} className="rounded-md" />
          </div>
          <Skeleton variant="text" width="85%" height={28} className="rounded-lg" />
          <Skeleton variant="text" width="65%" height={14} className="opacity-60" />
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
          <SkeletonButton width={140} height={44} className="bg-orange-500/20" />
          <SkeletonButton width={130} height={44} />
          <SkeletonButton width={110} height={44} className="hidden sm:block" />
        </div>
      </div>

      {/* ─── 4 Metric Cards Grid Skeleton ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Resumes', icon: 20 },
          { label: 'Avg. ATS Score', icon: 20 },
          { label: 'Profile Health', icon: 20 },
          { label: 'AI Credits', icon: 20 },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <Skeleton variant="text" width={80} height={12} className="opacity-70" />
              <Skeleton variant="circular" width={32} height={32} />
            </div>
            <div className="flex items-baseline gap-2">
              <Skeleton variant="text" width={60} height={28} className="rounded-md" />
              <Skeleton variant="text" width={40} height={12} className="opacity-50" />
            </div>
            <Skeleton variant="rectangular" height={4} className="w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* ─── Search & Controls Bar Skeleton ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton variant="text" width={160} height={22} className="rounded-md" />
          <Skeleton variant="rectangular" width={32} height={20} className="rounded-full" />
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Skeleton variant="rectangular" height={40} className="w-full sm:w-64 rounded-xl" />
          <Skeleton variant="rectangular" width={40} height={40} className="rounded-xl flex-shrink-0" />
        </div>
      </div>

      {/* ─── Resume Cards Grid Skeleton ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] p-5 space-y-4 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                <Skeleton variant="text" width="75%" height={18} className="rounded-md" />
                <div className="flex items-center gap-2">
                  <Skeleton variant="rectangular" width={68} height={20} className="rounded-md" />
                  <Skeleton variant="text" width={80} height={12} className="opacity-50" />
                </div>
              </div>
              <Skeleton variant="circular" width={44} height={44} />
            </div>

            {/* Resume Preview Mini Wireframe */}
            <div className="p-3.5 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)]/60 space-y-2">
              <Skeleton variant="text" width="40%" height={10} className="bg-orange-500/20" />
              <SkeletonText lines={2} lastLineWidth="85%" />
            </div>

            {/* Footer Status & Actions */}
            <div className="pt-2 border-t border-[var(--ox-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton variant="circular" width={14} height={14} />
                <Skeleton variant="text" width={70} height={10} className="opacity-60" />
              </div>
              <div className="flex items-center gap-1.5">
                <Skeleton variant="rectangular" width={32} height={32} className="rounded-lg" />
                <Skeleton variant="rectangular" width={32} height={32} className="rounded-lg" />
                <Skeleton variant="rectangular" width={60} height={32} className="rounded-lg bg-orange-500/20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
