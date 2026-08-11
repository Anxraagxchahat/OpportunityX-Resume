import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Grid,
  CheckCircle2,
  Wand2,
  Sparkles,
  User,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { ThemeTogglePill } from '../ThemeTogglePill';
import { UserAvatar } from '../UserAvatar';

export const TabletTopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    session,
    aiCredits,
    setIsUnlockAIModalOpen,
    setIsAICreditsModalOpen,
    setIsAuthOpen
  } = useResume();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const primaryNavItems = [
    { label: 'Builder', to: '/builder', icon: FileText },
    { label: 'Templates', to: '/templates', icon: Grid }
  ];

  const secondaryNavItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'ATS Checker', to: '/ats-checker', icon: CheckCircle2 },
    { label: 'AI Suite', to: '/ai-assistant', icon: Wand2 }
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-[var(--ox-surface-primary)] border-b border-[var(--ox-border)] backdrop-blur-md px-4 flex items-center justify-between gap-2 select-none transition-colors duration-300 no-print">
      {/* LEFT: Branding */}
      <Link to="/" className="flex items-center gap-2.5 min-w-max group cursor-pointer">
        <img
          src="/favicon.png"
          alt="OpportunityX Logo"
          className="w-8 h-8 rounded-full object-cover shadow-[0_0_10px_rgba(249,115,22,0.25)] group-hover:scale-105 transition-transform"
        />
        <div className="flex flex-col text-left">
          <span className="text-base font-black tracking-tight text-[var(--ox-text-primary)] leading-none">
            Opportunity<span className="text-[#F97316]">X</span>
          </span>
          <span className="text-[8px] uppercase tracking-widest font-extrabold text-[#F97316] mt-0.5 leading-none">
            RESUME
          </span>
        </div>
      </Link>

      {/* CENTER: Primary Navigation */}
      <nav className="flex items-center gap-1 bg-[var(--ox-surface-secondary)] p-1 rounded-xl border border-[var(--ox-border)]">
        {/* Full links on wider tablet, compact or icon-only on narrow tablet */}
        <Link
          to="/dashboard"
          className={`px-3 min-h-[44px] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            location.pathname === '/dashboard'
              ? 'bg-[#F97316]/15 text-[#F97316] font-bold shadow-sm'
              : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-[#F97316]" />
          <span className="hidden min-[850px]:inline">Dashboard</span>
        </Link>

        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 min-h-[44px] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-[#F97316]/15 text-[#F97316] font-bold shadow-sm'
                  : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F97316]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Links shown directly on wide tablet (>=850px) */}
        <div className="hidden min-[850px]:flex items-center gap-1">
          <Link
            to="/ats-checker"
            className={`px-3 min-h-[44px] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              location.pathname === '/ats-checker'
                ? 'bg-[#F97316]/15 text-[#F97316] font-bold shadow-sm'
                : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
            <span>ATS</span>
          </Link>
          <Link
            to="/ai-assistant"
            className={`px-3 min-h-[44px] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              location.pathname === '/ai-assistant'
                ? 'bg-[#F97316]/15 text-[#F97316] font-bold shadow-sm'
                : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)]'
            }`}
          >
            <Wand2 className="w-4 h-4 text-slate-400" />
            <span>AI</span>
          </Link>
        </div>

        {/* Compact "More" dropdown for narrow tablet (<850px) */}
        <div className="min-[850px]:hidden relative">
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className="px-2.5 min-h-[44px] rounded-lg text-xs font-semibold text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] flex items-center gap-1"
          >
            <MoreHorizontal className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isMoreMenuOpen && (
            <div
              className="absolute left-0 top-full mt-2 w-48 bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-xl shadow-2xl p-1 z-50 animate-fadeIn"
              onMouseLeave={() => setIsMoreMenuOpen(false)}
            >
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMoreMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#F97316]/15 text-[#F97316] font-bold'
                        : 'text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#F97316]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-2 min-w-max">
        {/* Theme Toggle */}
        <ThemeTogglePill />

        {/* Credits Pill (Always visible) */}
        <button
          onClick={() => {
            if (!session?.isAuthenticated || session?.isGuest) {
              setIsUnlockAIModalOpen(true);
            } else {
              setIsAICreditsModalOpen(true);
            }
          }}
          className="min-h-[44px] px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          title="AI Credits"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0 animate-pulse" />
          <span>{aiCredits?.remaining || 5} Cr</span>
        </button>

        {/* Profile / Account Button (Always visible) */}
        <button
          onClick={() => setIsAuthOpen(true)}
          className="min-h-[44px] px-3 py-2 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          title="Account / Session Profile"
        >
          {session?.isAuthenticated && !session?.isGuest && session?.user ? (
            <UserAvatar user={session.user} size="w-5 h-5" />
          ) : (
            <User className="w-4 h-4 text-orange-400" />
          )}
          <span className="text-xs font-semibold hidden min-[900px]:inline">
            {session?.isAuthenticated && !session?.isGuest ? session.user?.name : 'Account'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default TabletTopBar;
