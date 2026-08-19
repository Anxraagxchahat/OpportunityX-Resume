import React from 'react';
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonButton } from './Skeleton';

export const BuilderSkeleton = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[var(--ox-bg)] select-none">
      {/* ─── Top Workspace Toolbar Skeleton ─── */}
      <div className="h-14 border-b border-[var(--ox-border)] bg-[var(--ox-surface-primary)] px-4 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={160} height={20} className="rounded-md" />
          <Skeleton variant="rectangular" width={64} height={22} className="rounded-full hidden sm:block" />
          <Skeleton variant="text" width={90} height={14} className="rounded-md hidden md:block opacity-60" />
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Skeleton variant="rectangular" width={72} height={32} className="rounded-lg" />
          <Skeleton variant="rectangular" width={72} height={32} className="rounded-lg" />
        </div>

        <div className="flex items-center gap-2.5">
          <SkeletonButton width={90} height={36} className="hidden sm:block" />
          <SkeletonButton width={105} height={36} className="hidden md:block" />
          <SkeletonButton width={120} height={36} className="bg-orange-500/20" />
        </div>
      </div>

      {/* ─── Main 3-Column Split Workspace ─── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Vertical Section Navigation */}
        <div className="w-16 md:w-56 border-r border-[var(--ox-border)] bg-[var(--ox-surface-primary)] p-3 flex flex-col gap-2 flex-shrink-0">
          <div className="space-y-1.5 hidden md:block mb-2 px-1">
            <Skeleton variant="text" width="50%" height={10} className="opacity-50 uppercase" />
          </div>
          {[
            { width: '75%', icon: 20 },
            { width: '85%', icon: 20 },
            { width: '70%', icon: 20 },
            { width: '80%', icon: 20 },
            { width: '60%', icon: 20 },
            { width: '75%', icon: 20 },
            { width: '65%', icon: 20 },
            { width: '80%', icon: 20 },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2.5 rounded-xl border border-[var(--ox-border)]/40 ${
                idx === 0 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-[var(--ox-surface-secondary)]/50'
              }`}
            >
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width={item.width} height={12} className="hidden md:block" />
            </div>
          ))}
          <div className="mt-auto hidden md:block pt-3 border-t border-[var(--ox-border)]">
            <Skeleton variant="rectangular" height={36} className="w-full rounded-xl" />
          </div>
        </div>

        {/* Center Section Editor Form Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-2xl mx-auto w-full">
          {/* Section Banner Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--ox-border)]">
            <div className="space-y-2">
              <Skeleton variant="text" width={180} height={22} className="rounded-md" />
              <Skeleton variant="text" width={260} height={12} className="opacity-60" />
            </div>
            <SkeletonButton width={95} height={34} />
          </div>

          {/* Form Input Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton variant="text" width={90} height={12} />
              <Skeleton variant="rectangular" height={42} className="w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton variant="text" width={100} height={12} />
              <Skeleton variant="rectangular" height={42} className="w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton variant="text" width={80} height={12} />
              <Skeleton variant="rectangular" height={42} className="w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton variant="text" width={110} height={12} />
              <Skeleton variant="rectangular" height={42} className="w-full rounded-xl" />
            </div>
          </div>

          {/* Textarea Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton variant="text" width={120} height={12} />
              <Skeleton variant="text" width={70} height={12} className="opacity-50" />
            </div>
            <Skeleton variant="rectangular" height={96} className="w-full rounded-xl" />
          </div>

          {/* Card Item Accordion Skeleton */}
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Skeleton variant="circular" width={18} height={18} />
                  <Skeleton variant="text" width={140} height={16} />
                </div>
                <div className="flex gap-2">
                  <Skeleton variant="rectangular" width={28} height={28} className="rounded-lg" />
                  <Skeleton variant="rectangular" width={28} height={28} className="rounded-lg" />
                </div>
              </div>
              <SkeletonText lines={2} lastLineWidth="80%" />
            </div>

            <div className="p-4 rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] space-y-3 opacity-70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Skeleton variant="circular" width={18} height={18} />
                  <Skeleton variant="text" width={160} height={16} />
                </div>
                <Skeleton variant="rectangular" width={28} height={28} className="rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Live A4 Canvas Preview Skeleton (Desktop) */}
        <div className="hidden xl:flex w-[42%] border-l border-[var(--ox-border)] bg-[var(--ox-surface-secondary)]/60 flex-col items-center justify-center p-6 relative">
          {/* Zoom & Fit Bar */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-xl p-1.5 shadow-sm">
            <Skeleton variant="rectangular" width={28} height={28} className="rounded-lg" />
            <Skeleton variant="rectangular" width={40} height={24} className="rounded-md" />
            <Skeleton variant="rectangular" width={28} height={28} className="rounded-lg" />
          </div>

          {/* Scaled A4 Sheet Mockup */}
          <div className="w-[360px] h-[510px] bg-[var(--ox-surface-primary)] rounded-xl border border-[var(--ox-border)] shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
            <div className="space-y-4">
              {/* Resume Header */}
              <div className="border-b border-[var(--ox-border)] pb-3 space-y-2">
                <Skeleton variant="text" width="60%" height={16} className="bg-orange-500/20" />
                <Skeleton variant="text" width="35%" height={10} />
                <div className="flex gap-2 pt-1">
                  <Skeleton variant="text" width={60} height={8} />
                  <Skeleton variant="text" width={70} height={8} />
                  <Skeleton variant="text" width={55} height={8} />
                </div>
              </div>

              {/* Summary Block */}
              <div className="space-y-1.5">
                <Skeleton variant="text" width="25%" height={10} className="font-bold" />
                <SkeletonText lines={2} lastLineWidth="90%" />
              </div>

              {/* Experience Block */}
              <div className="space-y-2">
                <Skeleton variant="text" width="30%" height={10} className="font-bold" />
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton variant="text" width="45%" height={9} />
                    <Skeleton variant="text" width="20%" height={9} />
                  </div>
                  <SkeletonText lines={2} lastLineWidth="75%" />
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-1.5 pt-1">
                <Skeleton variant="text" width="20%" height={10} />
                <div className="flex flex-wrap gap-1.5">
                  <Skeleton variant="rectangular" width={48} height={16} className="rounded-full" />
                  <Skeleton variant="rectangular" width={58} height={16} className="rounded-full" />
                  <Skeleton variant="rectangular" width={52} height={16} className="rounded-full" />
                  <Skeleton variant="rectangular" width={42} height={16} className="rounded-full" />
                  <Skeleton variant="rectangular" width={60} height={16} className="rounded-full" />
                </div>
              </div>
            </div>

            {/* Bottom Brand Watermark Line */}
            <div className="flex justify-between items-center pt-2 border-t border-[var(--ox-border)] opacity-40">
              <Skeleton variant="text" width={70} height={7} />
              <Skeleton variant="text" width={30} height={7} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderSkeleton;
