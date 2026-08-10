import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Grid,
  CheckCircle2,
  Wand2,
  Menu,
  X,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '../context/ResumeContext';
import { AuthModal } from './AuthModal';
import { ThemeTogglePill } from './ThemeTogglePill';
import { UserAvatar } from './UserAvatar';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    session,
    aiCredits,
    loadDemoResume,
    setIsUnlockAIModalOpen,
    setIsAICreditsModalOpen,
    isAuthOpen,
    setIsAuthOpen
  } = useResume();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Builder', to: '/builder', icon: FileText },
    { label: 'Templates', to: '/templates', icon: Grid },
    { label: 'ATS Intelligence', to: '/ats-checker', icon: CheckCircle2 },
    { label: 'AI Suite', to: '/ai-assistant', icon: Wand2 }
  ];

  const isBuilderRoute = location.pathname === '/builder';

  return (
    <header className={`${isBuilderRoute ? 'hidden md:block' : ''} sticky top-0 z-50 w-full bg-[var(--ox-surface-primary)] backdrop-blur-md border-b border-[var(--ox-border)] transition-colors duration-300 no-print`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-3">

        {/* Mobile Left Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] flex-shrink-0"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Area */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0 mx-auto md:mx-0">
          <img
            src="/favicon.png"
            alt="OpportunityX Logo"
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-[0_0_12px_rgba(249,115,22,0.25)] group-hover:scale-105 transition-transform"
          />

          <div className="flex flex-col justify-center text-left">
            <span className="text-lg font-black tracking-tight text-[var(--ox-text-primary)] font-sans leading-none">
              Opportunity<span className="text-[#F97316]">X</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 w-max mt-1 leading-none shadow-[0_0_8px_rgba(249,115,22,0.12)]">
              RESUME
            </span>
          </div>
        </Link>

        {/* Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--ox-surface-secondary)] p-1.5 rounded-[16px] border border-[var(--ox-border)] relative transition-colors duration-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex flex-col items-center justify-center px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive ? 'text-[var(--ox-text-primary)] font-semibold' : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)]'
                }`}
              >
                <div className="flex items-center gap-1.5 relative z-10">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F97316]' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="w-1.5 h-1.5 rounded-full bg-[#F97316] shadow-[0_0_8px_#F97316] mt-1"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle + AI Credits Pill + Auth User Profile */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Theme Toggle Pill Switch */}
          <ThemeTogglePill />

          {/* AI Credits Pill Button */}
          <button
            onClick={() => {
              if (!session.isAuthenticated || session.isGuest) {
                setIsUnlockAIModalOpen(true);
              } else {
                setIsAICreditsModalOpen(true);
              }
            }}
            className="px-2.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            title="View AI Credits & Packs"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">
              {session.isAuthenticated && !session.isGuest ? `${aiCredits.remaining} Credits` : 'Claim 5 Free Credits'}
            </span>
            <span className="sm:hidden">{aiCredits.remaining || 5} Cr</span>
          </button>

          <button
            onClick={() => setIsAuthOpen(true)}
            className="p-1.5 px-2.5 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            title="OpportunityX Account & Session"
          >
            {session.isAuthenticated && !session.isGuest && session.user ? (
              <UserAvatar user={session.user} size="w-5 h-5" />
            ) : (
              <User className="w-4 h-4 text-orange-400" />
            )}
            <span className="hidden lg:inline text-xs font-semibold">
              {session.isAuthenticated && !session.isGuest ? session.user?.name : 'Guest (Free)'}
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--ox-surface-secondary)] border-b border-[var(--ox-border)] px-4 py-4 space-y-3"
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${
                  location.pathname === item.to
                    ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30'
                    : 'text-[var(--ox-text-primary)] hover:bg-slate-900/40'
                }`}
              >
                <item.icon className="w-4 h-4 text-[#F97316]" />
                <span>{item.label}</span>
              </Link>
            ))}

            <div className="pt-2 border-t border-[var(--ox-border)] flex items-center justify-between">
              <span className="text-xs text-[var(--ox-text-secondary)] font-semibold">App Theme:</span>
              <ThemeTogglePill />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
};
