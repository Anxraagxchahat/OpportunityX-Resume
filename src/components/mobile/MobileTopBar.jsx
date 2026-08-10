import React, { useState } from 'react';
import { Menu, Sparkles, User, Edit3, Check, ShieldCheck } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useMobileNavigation } from '../../context/MobileNavigationContext';

export const MobileTopBar = () => {
  const {
    activeResume,
    activeResumeId,
    renameResume,
    resumeHealth,
    session,
    aiCredits,
    setIsUnlockAIModalOpen,
    setIsAICreditsModalOpen,
    setIsAuthOpen
  } = useResume();

  const { setIsMoreMenuOpen } = useMobileNavigation();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(activeResume.metadata?.title || 'My Resume');

  const { percentage } = resumeHealth;

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (titleInput.trim()) {
      renameResume(activeResumeId, titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="w-full bg-[var(--ox-surface-primary)] border-b border-[var(--ox-border)] sticky top-0 z-30 transition-colors duration-200 no-print select-none">
      {/* Top Primary Bar */}
      <div className="px-3 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Menu Drawer Trigger */}
        <button
          onClick={() => setIsMoreMenuOpen(true)}
          className="p-2.5 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] active:scale-95 transition-transform min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 text-orange-500" />
        </button>

        {/* Center: Brand Header */}
        <div className="flex items-center gap-1.5 font-sans min-w-0">
          <img
            src="/favicon.png"
            alt="OpportunityX Logo"
            className="w-7 h-7 rounded-full object-cover shrink-0 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
          />
          <span className="text-xs sm:text-base font-black tracking-tight text-[var(--ox-text-primary)] truncate">
            OX <span className="text-[#F97316]">Resume</span>
          </span>
        </div>

        {/* Right: Credits & Auth Badges */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (!session.isAuthenticated || session.isGuest) {
                setIsUnlockAIModalOpen(true);
              } else {
                setIsAICreditsModalOpen(true);
              }
            }}
            className="px-2.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold flex items-center gap-1 min-h-[44px] cursor-pointer active:scale-95 transition-transform"
            title="AI Credits"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>{session.isAuthenticated && !session.isGuest ? `${aiCredits.remaining} Cr` : '5 Cr'}</span>
          </button>

          <button
            onClick={() => setIsAuthOpen(true)}
            className="p-2.5 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            aria-label="User Account"
          >
            <User className="w-4 h-4 text-orange-400" />
          </button>
        </div>
      </div>

      {/* Document Subheader (Title, Draft Status, Health Score) */}
      <div className="px-3 py-1.5 bg-[var(--ox-surface-secondary)]/60 border-t border-[var(--ox-border)] flex items-center justify-between gap-2 text-xs font-medium">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex items-center gap-1 flex-1">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                autoFocus
                className="bg-[var(--ox-card-bg)] border border-orange-500/50 rounded-lg px-2 py-1 text-xs font-bold text-[var(--ox-text-primary)] w-full focus:outline-none"
              />
              <button
                type="submit"
                className="p-1 rounded-md bg-orange-500 text-white min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setTitleInput(activeResume.metadata?.title || '');
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-1.5 font-extrabold text-[var(--ox-text-primary)] truncate hover:text-orange-400 text-left cursor-pointer"
            >
              <span className="truncate max-w-[160px] sm:max-w-[220px]">
                {activeResume.metadata?.title || 'My Resume'}
              </span>
              <Edit3 className="w-3 h-3 text-[var(--ox-text-muted)] shrink-0" />
            </button>
          )}

          <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 shrink-0">
            Active Draft
          </span>
        </div>

        {/* Health Score Pill */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-extrabold shrink-0">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Health {percentage}%</span>
        </div>
      </div>
    </header>
  );
};

export default MobileTopBar;
