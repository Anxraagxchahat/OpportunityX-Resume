import React, { useState, useEffect } from 'react';
import { Menu, Sparkles, User, Edit3, Check, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useMobileNavigation } from '../../context/MobileNavigationContext';
import { useTheme } from '../../context/ThemeProvider';
import { UserAvatar } from '../UserAvatar';

export const MobileTopBar = () => {
  const {
    activeResume = {},
    activeResumeId,
    renameResume,
    resumeHealth = { percentage: 0 },
    session = {},
    aiCredits = { remaining: 5 },
    setIsUnlockAIModalOpen,
    setIsAICreditsModalOpen,
    setIsAuthOpen
  } = useResume();

  const { isDark, toggleTheme } = useTheme();
  const { setIsMoreMenuOpen } = useMobileNavigation();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(activeResume?.metadata?.title || 'My Resume');

  useEffect(() => {
    setTitleInput(activeResume?.metadata?.title || 'My Resume');
  }, [activeResume?.metadata?.title]);

  const { percentage = 0 } = resumeHealth || {};

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (titleInput.trim()) {
      renameResume(activeResumeId, titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const docTitle = activeResume?.metadata?.title || 'My Resume';

  return (
    <header className="w-full max-w-full bg-[var(--ox-surface-primary)] border-b border-[var(--ox-border)] transition-colors duration-200 no-print select-none box-border">

      {/* ═══ Row 1: Primary Navigation Bar ═══ */}
      <div className="px-2.5 h-14 flex items-center justify-between gap-2 w-full max-w-full box-border">

        {/* LEFT: Menu + Brand */}
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          {/* Menu Button — 44×44 touch target */}
          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className="w-10 h-10 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] active:scale-95 transition-transform flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Open Navigation Menu"
            style={{ minWidth: 40, minHeight: 40 }}
          >
            <Menu className="w-5 h-5 text-orange-500" />
          </button>

          {/* Brand: Logo + Text */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            <img
              src="/favicon.png"
              alt="OpportunityX Logo"
              className="w-7 h-7 rounded-full object-cover shrink-0 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
            />
            <div className="flex flex-col min-w-0 leading-none">
              <span className="font-black tracking-tight text-[var(--ox-text-primary)] truncate text-sm">
                <span className="mobile-brand-full">Opportunity<span className="text-[#F97316]">X</span></span>
                <span className="mobile-brand-short">OX</span>
              </span>
              <span className="text-[8px] uppercase tracking-widest font-extrabold text-[#F97316] leading-none mt-0.5">
                RESUME
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Theme + Credits + Account — Never wraps, never shrinks */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Theme Toggle — icon only, 36px visual / 44px touch */}
          <button
            onClick={toggleTheme}
            type="button"
            className="w-9 h-9 rounded-full bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] flex items-center justify-center cursor-pointer active:scale-95 transition-transform shrink-0"
            title={`Toggle Theme (${isDark ? 'Dark' : 'Light'})`}
            aria-label="Toggle theme"
            style={{ minWidth: 36, minHeight: 36 }}
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            ) : (
              <Sun className="w-4 h-4 text-orange-500 fill-orange-500/20" />
            )}
          </button>

          {/* AI Credits Button */}
          <button
            onClick={() => {
              if (!session.isAuthenticated || session.isGuest) {
                setIsUnlockAIModalOpen(true);
              } else {
                setIsAICreditsModalOpen(true);
              }
            }}
            className="h-9 px-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-transform shrink-0"
            title="AI Credits"
            aria-label="AI Credits Balance"
            style={{ minHeight: 36 }}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400 shrink-0" />
            <span className="mobile-credits-full font-extrabold">{session.isAuthenticated && !session.isGuest ? `${aiCredits.remaining} Cr` : '5 Cr'}</span>
            <span className="mobile-credits-short font-extrabold">{session.isAuthenticated && !session.isGuest ? aiCredits.remaining : '5'}</span>
          </button>

          {/* Account / Profile / Login — ALWAYS visible */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="w-10 h-10 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] flex items-center justify-center cursor-pointer active:scale-95 transition-transform shrink-0"
            aria-label="Account"
            title={session?.isAuthenticated && !session?.isGuest ? session.user?.name || 'User Account' : 'Sign In / Account'}
            style={{ minWidth: 40, minHeight: 40 }}
          >
            {session?.isAuthenticated && !session?.isGuest && session?.user ? (
              <UserAvatar user={session.user} size="w-5 h-5" />
            ) : (
              <User className="w-5 h-5 text-orange-400 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* ═══ Row 2: Document Subheader (Title + Health) ═══ */}
      <div className="px-3 h-10 bg-[var(--ox-surface-secondary)]/60 border-t border-[var(--ox-border)] flex items-center justify-between gap-2 text-xs font-medium w-full max-w-full box-border">

        {/* Left: Document Title + Edit */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex items-center gap-1 flex-1 min-w-0">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                autoFocus
                className="bg-[var(--ox-card-bg)] border border-orange-500/50 rounded-lg px-2 py-1 text-xs font-bold text-[var(--ox-text-primary)] flex-1 min-w-0 focus:outline-none"
              />
              <button
                type="submit"
                className="p-1 rounded-md bg-orange-500 text-white flex items-center justify-center shrink-0"
                style={{ minWidth: 28, minHeight: 28 }}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setTitleInput(docTitle);
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-1 font-extrabold text-[var(--ox-text-primary)] hover:text-orange-400 text-left cursor-pointer min-w-0 overflow-hidden"
            >
              <span className="truncate" style={{ maxWidth: 'calc(100vw - 200px)' }}>
                {docTitle}
              </span>
              <Edit3 className="w-3 h-3 text-[var(--ox-text-muted)] shrink-0" />
            </button>
          )}
        </div>

        {/* Right: Health Score Pill */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-extrabold shrink-0">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>{percentage}%</span>
        </div>
      </div>
    </header>
  );
};

export default MobileTopBar;
