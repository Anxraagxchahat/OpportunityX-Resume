import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Grid,
  CheckCircle2,
  Wand2,
  Sparkles,
  User,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '../../context/ResumeContext';
import { ThemeTogglePill } from '../ThemeTogglePill';
import { UserAvatar } from '../UserAvatar';

import { BrandLogo } from '../common/BrandLogo';
import { useTheme } from '../../context/ThemeProvider';

export const TabletTopBar = () => {
  const location = useLocation();
  const { isMono } = useTheme();
  const {
    session,
    aiCredits,
    setIsUnlockAIModalOpen,
    setIsAICreditsModalOpen,
    setIsAuthOpen
  } = useResume();

  const isGuest = !session?.isAuthenticated || session?.isGuest;

  const navItems = [
    { label: 'Dashboard', shortLabel: 'Dash', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Builder', shortLabel: 'Build', to: '/builder', icon: FileText },
    { label: 'Templates', shortLabel: 'Templates', to: '/templates', icon: Grid },
    { label: 'ATS Intel', shortLabel: 'ATS', to: '/ats-checker', icon: CheckCircle2 },
    { label: 'AI Suite', shortLabel: 'AI Suite', to: '/ai-assistant', icon: Wand2 }
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[var(--ox-surface-primary)] border-b border-[var(--ox-border)] backdrop-blur-md px-3 sm:px-4 md:px-5 flex items-center justify-between gap-2 sm:gap-3 select-none transition-colors duration-300 no-print">
      {/* ─── LEFT: OpportunityX Branding ─── */}
      <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group cursor-pointer focus:outline-none">
        <BrandLogo
          variant="icon"
          size="w-8 h-8"
          className="group-hover:scale-105 transition-transform"
        />
        <div className="flex flex-col text-left">
          <span className="text-sm sm:text-base font-black tracking-tight text-[var(--ox-text-primary)] leading-none">
            Opportunity<span className={isMono ? "text-black" : "text-[#F97316]"}>X</span>
          </span>
          <span className={`text-[8px] uppercase tracking-widest font-extrabold ${isMono ? "text-black" : "text-[#F97316]"} mt-0.5 leading-none`}>
            RESUME
          </span>
        </div>
      </Link>

      {/* ─── CENTER: Unified Fluid Navigation with Sliding Glass Pill ─── */}
      <nav className="flex items-center gap-1 bg-[var(--ox-surface-secondary)] p-1 rounded-2xl border border-[var(--ox-border)] relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative px-2.5 sm:px-3 min-h-[44px] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-200 z-10 ${
                isActive
                  ? 'text-[#F97316] font-bold'
                  : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)]'
              }`}
            >
              {/* Sliding glass active background */}
              {isActive && (
                <motion.div
                  layoutId="tabletNavActive"
                  className="absolute inset-0 bg-[#F97316]/15 border border-[#F97316]/30 rounded-xl shadow-[0_0_12px_rgba(249,115,22,0.12)] pointer-events-none z-[-1]"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#F97316]' : 'text-slate-400'
                }`}
              />
              <span className="hidden min-[920px]:inline whitespace-nowrap">{item.label}</span>
              <span className="inline min-[920px]:hidden whitespace-nowrap">{item.shortLabel || item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ─── RIGHT: Compact Theme + Claim Credits + Profile ─── */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Compact Sun/Moon Theme Toggle (No AMOLED text) */}
        <ThemeTogglePill compact={true} />

        {/* Claim 5 Free Credits / Credit Status */}
        <button
          type="button"
          onClick={() => {
            if (isGuest) {
              setIsUnlockAIModalOpen(true);
            } else {
              setIsAICreditsModalOpen(true);
            }
          }}
          className="min-h-[44px] px-2.5 sm:px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          title={isGuest ? 'Claim 5 Free AI Credits' : `${aiCredits?.remaining || 5} AI Credits`}
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0 animate-pulse" />
          <span className="hidden min-[840px]:inline">
            {isGuest ? 'Claim 5 Free Credits' : `${aiCredits?.remaining || 5} Credits`}
          </span>
          <span className="inline min-[840px]:hidden">
            {isGuest ? '5 Free Cr' : `${aiCredits?.remaining || 5} Cr`}
          </span>
        </button>

        {/* Guest / Account Profile Button (Zero Overflow) */}
        <button
          type="button"
          onClick={() => setIsAuthOpen(true)}
          className="min-h-[44px] min-w-[44px] px-2 sm:px-3 py-2 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          title="OpportunityX Account & Session"
        >
          {session?.isAuthenticated && !session?.isGuest && session?.user ? (
            <UserAvatar user={session.user} size="w-5 h-5" />
          ) : (
            <User className="w-4 h-4 text-orange-400 shrink-0" />
          )}
          <span className="text-xs font-semibold hidden min-[900px]:inline truncate max-w-[80px]">
            {!isGuest && session?.user?.name ? session.user.name : 'Guest'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default TabletTopBar;
