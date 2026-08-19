import React from 'react';
import { Skeleton, SkeletonText, SkeletonButton, SkeletonAvatar } from './Skeleton';

export const ATSCheckerSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--ox-bg)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* ─── Top Header & Summary Card ─── */}
      <div className="p-6 sm:p-8 rounded-3xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Circular ATS Gauge Placeholder */}
          <div className="relative flex-shrink-0">
            <Skeleton variant="circular" width={110} height={110} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Skeleton variant="rectangular" width={120} height={22} className="rounded-full bg-orange-500/20" />
              <Skeleton variant="rectangular" width={70} height={22} className="rounded-full" />
            </div>
            <Skeleton variant="text" width={220} height={26} className="rounded-lg" />
            <Skeleton variant="text" width={320} height={14} className="opacity-60" />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full sm:w-auto">
          <SkeletonButton width={160} height={44} className="bg-orange-500/20" />
          <SkeletonButton width={160} height={40} />
        </div>
      </div>

      {/* ─── Navigation Tabs Skeleton ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-[var(--ox-border)]">
        {['Overview', 'ATS Rules', 'Keyword Matcher', 'Recruiter View', 'Fix Suggestions'].map((_, idx) => (
          <Skeleton
            key={idx}
            variant="rectangular"
            width={120}
            height={36}
            className={`rounded-xl flex-shrink-0 ${idx === 0 ? 'bg-orange-500/20' : ''}`}
          />
        ))}
      </div>

      {/* ─── 2-Column Split: JD Matcher + Breakdown Cards ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Job Description Matcher Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton variant="text" width={160} height={18} />
              <Skeleton variant="circular" width={24} height={24} />
            </div>
            <Skeleton variant="text" width="90%" height={12} className="opacity-60" />
            <Skeleton variant="rectangular" height={130} className="w-full rounded-xl" />
            <SkeletonButton width="100%" height={44} className="bg-orange-500/20 w-full" />
          </div>

          <div className="p-5 rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-3">
            <Skeleton variant="text" width={140} height={16} />
            <SkeletonText lines={3} />
          </div>
        </div>

        {/* Right Column: Score Breakdown & Keyword Badges */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--ox-border)] pb-4">
              <Skeleton variant="text" width={180} height={20} />
              <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
            </div>

            {/* Metric Bars */}
            <div className="space-y-4">
              {[
                { width: '85%' },
                { width: '70%' },
                { width: '92%' },
                { width: '60%' },
              ].map((m, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton variant="text" width={120} height={12} />
                    <Skeleton variant="text" width={40} height={12} />
                  </div>
                  <Skeleton variant="rectangular" height={8} className="w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Keyword Badges Skeleton */}
          <div className="p-6 rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-4">
            <Skeleton variant="text" width={160} height={18} />
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Node.js', 'Next.js', 'GraphQL', 'AWS', 'Docker', 'CI/CD', 'Tailwind CSS'].map((_, idx) => (
                <Skeleton
                  key={idx}
                  variant="rectangular"
                  width={idx % 2 === 0 ? 76 : 94}
                  height={28}
                  className="rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSCheckerSkeleton;
