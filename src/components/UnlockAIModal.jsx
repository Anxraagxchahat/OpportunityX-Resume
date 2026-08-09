import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Check, Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const GoogleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export const UnlockAIModal = ({ isOpen, onClose }) => {
  const { isUnlockAIModalOpen, setIsUnlockAIModalOpen, setIsAuthOpen } = useResume();
  const [emailInput, setEmailInput] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const active = isOpen !== undefined ? isOpen : isUnlockAIModalOpen;
  const handleClose = onClose || (() => setIsUnlockAIModalOpen(false));

  if (!active) return null;

  const openRealAuth = () => {
    handleClose();
    setIsAuthOpen(true);
  };

  const handleOAuthLogin = () => {
    openRealAuth();
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    openRealAuth();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-[var(--ox-card-bg,#0B0D14)] border border-[var(--ox-border)] rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 relative max-h-[92vh] overflow-y-auto custom-scrollbar transition-colors duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)] p-1 rounded-lg hover:bg-[var(--ox-surface-secondary)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Guarantee Line */}
        <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[11px] text-orange-600 dark:text-orange-300 font-semibold text-center leading-snug">
          Resume Builder will always remain free. Login is only required to unlock AI features and save AI credits.
        </div>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-orange-500 flex-shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[var(--ox-text-primary)]">Unlock AI Features</h3>
            <p className="text-xs text-[var(--ox-text-secondary)] mt-0.5">
              Login to claim your <strong className="text-amber-500 font-bold">5 FREE Welcome AI Credits</strong>.
            </p>
            <p className="text-[11px] text-[var(--ox-text-muted)]">
              Continue building resumes without login anytime.
            </p>
          </div>
        </div>

        {/* AI Benefits Checklist */}
        <div className="p-4 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ox-text-secondary)]">Included AI Benefits:</span>
          <div className="grid grid-cols-2 gap-2 text-xs text-[var(--ox-text-primary)] pt-1">
            <div className="flex items-center gap-1.5 font-semibold text-orange-500">
              <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span>5 Welcome Credits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>AI Summary Generator</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>AI Resume Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Experience Rewrite</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Grammar Assistant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Cover Letter Generator</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>LinkedIn Generator</span>
            </div>
          </div>
        </div>

        {/* Login Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={() => openRealAuth()}
            className="w-full py-3 px-4 rounded-xl bg-[var(--ox-surface-primary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] text-xs font-bold text-[var(--ox-text-primary)] flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
          >
            <GoogleIcon className="w-4 h-4 flex-shrink-0" /> Continue with Google
          </button>

          <button
            onClick={() => openRealAuth()}
            className="w-full py-3 px-4 rounded-xl bg-[var(--ox-surface-primary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] text-xs font-bold text-[var(--ox-text-primary)] flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
          >
            <GithubIcon className="w-4 h-4 flex-shrink-0" /> Continue with GitHub
          </button>

          {!showEmailForm ? (
            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] text-xs font-semibold text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[var(--ox-text-muted)]" /> Continue with Email
            </button>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-2 p-3 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)]">
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--ox-text-muted)] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Claim 5 Free Credits & Continue</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <button
            onClick={handleClose}
            className="w-full py-2 text-xs font-semibold text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)] transition-colors cursor-pointer"
          >
            Cancel (Continue Editing Without Login)
          </button>
        </div>

        {/* Login Benefits Summary */}
        <div className="pt-3 border-t border-[var(--ox-border)] space-y-1.5">
          <span className="text-[11px] font-bold text-[var(--ox-text-secondary)]">Login gives you:</span>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[var(--ox-text-muted)]">
            <span className="text-emerald-500 font-semibold">✓ 5 Welcome AI Credits</span>
            <span>✓ AI Features</span>
            <span>✓ Cloud Backup</span>
            <span>✓ Multi-device Sync</span>
            <span>✓ Purchased Credits</span>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-3 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[10px] text-[var(--ox-text-muted)] space-y-1 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-[var(--ox-text-secondary)]">
            <Shield className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Your Resume Privacy is Guaranteed
          </div>
          <p>
            Your resume is private. OpportunityX does not sell your personal data. AI requests are processed only when you use AI features. Only the minimum required resume content is sent for AI generation.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};
