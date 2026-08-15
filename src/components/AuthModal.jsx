/**
 * OpportunityX Resume — Authentication Modal
 *
 * Production-grade authentication modal with real Firebase Auth:
 * - Google OAuth (signInWithPopup)
 * - GitHub OAuth (signInWithPopup)
 * - Email/Password (signInWithEmailAndPassword / createUserWithEmailAndPassword)
 * - Password Reset (sendPasswordResetEmail)
 *
 * Continue-after-login: accepts onSuccess callback to resume interrupted actions.
 * Never writes to central OpportunityX user profiles.
 */
import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X, ShieldCheck, Mail, LogIn, LogOut, Check, Eye, EyeOff,
  Loader2, AlertCircle, KeyRound, ArrowLeft
} from 'lucide-react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { normalizeProvider, getProviderLabel } from '../utils/authProviders';
import { trackAuthEvent, getAuthEventName } from '../utils/authAnalytics';
import { UserAvatar } from './UserAvatar';

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const GoogleIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { session } = useResume();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProvider, setActiveProvider] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSuccess = (firebaseUser) => {
    setError('');
    setSuccessMsg(`Welcome, ${firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'}!`);

    trackAuthEvent(getAuthEventName(normalizeProvider(firebaseUser), mode === 'signup'), {
      uid: firebaseUser.uid,
      provider: normalizeProvider(firebaseUser),
    });

    setTimeout(() => {
      setSuccessMsg('');
      setEmail('');
      setPassword('');
      setMode('login');
      onClose();
      if (onSuccess) onSuccess(firebaseUser);
    }, 800);
  };

  const handleError = (firebaseError) => {
    trackAuthEvent('auth_error', { code: firebaseError.code, message: firebaseError.message });

    const msg = firebaseError.message || '';
    if (msg.includes('redirect_uri') || (firebaseError.code === 'auth/invalid-credential' && activeProvider === 'github')) {
      setError('GitHub OAuth Callback URL is misconfigured in GitHub OAuth App settings. Authorization Callback URL must be set to: https://opportunityx-61efd.firebaseapp.com/__/auth/handler');
      return;
    }

    const errorMap = {
      'auth/unauthorized-domain': 'This domain is not authorized in Firebase. Please ensure www.resume.opportunityx.co.in is added to Firebase Authorized Domains.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/user-not-found': 'No account found with this email. Try signing up.',
      'auth/email-already-in-use': 'This email already has an account. Please log in instead.',
      'auth/invalid-credential': 'Invalid credentials. Please check and try again.',
      'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
      'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
      'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups for this site.',
      'auth/network-request-failed': 'Network error. Please check your connection and try again.',
    };

    const errorCode = firebaseError?.code || '';
    const rawMsg = firebaseError?.message || (typeof firebaseError === 'string' ? firebaseError : '');
    setError(errorMap[errorCode] || rawMsg || 'Authentication failed. Please try again.');
  };

  const handleOAuthLogin = async (provider, providerInstance) => {
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);
    setActiveProvider(provider);

    try {
      const result = await signInWithPopup(auth, providerInstance);
      handleSuccess(result.user);
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
      setActiveProvider('');
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Email is required.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setActiveProvider('email');

    try {
      if (mode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        handleSuccess(result.user);
      } else {
        const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
        handleSuccess(result.user);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
      setActiveProvider('');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Enter your email to receive a reset link.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setSuccessMsg('Password reset email sent! Check your inbox.');
      trackAuthEvent('password_reset', { email: cleanEmail });
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const isLoading = isSubmitting;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
      <div className="bg-[var(--ox-card-bg,#0B0D14)] border border-[var(--ox-border,#1F1F1F)] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[85vh] transition-colors duration-300 relative">
        
        {/* Sticky Header with Title & 44×44px Touch Target Close Button */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 pb-3 bg-[var(--ox-card-bg,#0B0D14)] border-b border-[var(--ox-border,#1F1F1F)] shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="relative p-1 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
              <img
                src="/favicon.png"
                alt="OpportunityX Logo"
                className="w-9 h-9 rounded-full object-cover shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 items-center justify-center text-white font-black text-sm shadow-md">
                OX
              </div>
            </div>
            <div className="truncate">
              <h3 className="text-base font-black text-[var(--ox-text-primary)] flex items-center gap-1 truncate">
                Opportunity<span className="text-orange-500">X</span> Account
              </h3>
              <p className="text-[11px] text-[var(--ox-text-secondary)] truncate">Central ecosystem authentication</p>
            </div>
          </div>

          {/* Close Button — 44x44px minimum touch target, always visible */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-11 h-11 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-40 active:scale-95 shadow-sm"
            aria-label="Close authentication modal"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <X className="w-5 h-5 text-orange-500" />
          </button>
        </div>

        {/* Internal Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">

          {/* Reassurance Banner */}
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 font-semibold text-center">
            Resume Builder remains free forever. Login unlocks AI & Cloud sync.
          </div>

        {/* Authenticated State */}
        {isAuthenticated && user && (
          <div className="p-3 rounded-xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserAvatar user={user} size="w-9 h-9" />
              <div>
                <div className="text-[var(--ox-text-secondary)]">
                  Signed in as <strong className="text-emerald-400 font-bold">{user.displayName || user.name || user.email}</strong>
                </div>
                <div className="text-[10px] text-[var(--ox-text-muted)] flex items-center gap-1 mt-0.5">
                  <span>via {getProviderLabel(normalizeProvider(user))}</span>
                  <span>•</span>
                  <span>UID: {user.uid?.slice(0, 8)}...</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Benefits */}
        {(!isAuthenticated) && (
          <>
            <div className="p-3 rounded-xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] space-y-2">
              <span className="text-xs font-bold text-[var(--ox-text-secondary)]">Login gives you:</span>
              <div className="space-y-1.5 text-xs text-[var(--ox-text-secondary)]">
                {['5 Welcome AI Credits', 'Full Access to AI Features', 'Cloud Backup & Recovery', 'Multi-device Resume Sync', 'Purchased Credits Storage'].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className={benefit.includes('5 Welcome') ? 'font-semibold text-emerald-400' : ''}>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Password Mode */}
            {mode === 'reset' ? (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                  className="text-xs text-orange-500 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Login
                </button>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--ox-text-secondary)]">Email Address</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[var(--ox-text-muted)] absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      disabled={isLoading}
                      className="w-full bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Send Password Reset Email
                </button>
              </form>
            ) : (
              <>
                {/* OAuth Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleOAuthLogin('google', googleProvider)}
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-[var(--ox-surface-primary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] text-xs font-bold text-[var(--ox-text-primary)] flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {activeProvider === 'google' ? <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> : <GoogleIcon />}
                    Continue with Google
                  </button>

                  <button
                    onClick={() => handleOAuthLogin('github', githubProvider)}
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-[var(--ox-surface-primary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] text-xs font-bold text-[var(--ox-text-primary)] flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {activeProvider === 'github' ? <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> : <GithubIcon />}
                    Continue with GitHub
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[var(--ox-border)]" />
                  <span className="text-[10px] text-[var(--ox-text-muted)] font-bold uppercase">or</span>
                  <div className="flex-1 h-px bg-[var(--ox-border)]" />
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailAuth} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--ox-text-secondary)]">
                      {mode === 'signup' ? 'Create Account with Email' : 'Login with Email'}
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-[var(--ox-text-muted)] absolute left-3 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        disabled={isLoading}
                        className="w-full bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--ox-text-secondary)]">Password</label>
                    <div className="relative">
                      <KeyRound className="w-3.5 h-3.5 text-[var(--ox-text-muted)] absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        disabled={isLoading}
                        className="w-full bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-xl pl-9 pr-9 py-2.5 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('reset'); setError(''); setSuccessMsg(''); }}
                      className="text-[10px] text-orange-500 hover:underline font-bold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading && activeProvider === 'email' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    {mode === 'signup' ? 'Create Account & Claim 5 Credits' : 'Login & Continue'}
                  </button>
                </form>

                {/* Toggle Login / Signup */}
                <div className="text-center text-[11px] text-[var(--ox-text-secondary)]">
                  {mode === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
                        className="text-orange-500 font-bold hover:underline cursor-pointer"
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                        className="text-orange-500 font-bold hover:underline cursor-pointer"
                      >
                        Log In
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Footer */}
            <div className="text-center text-[10px] text-[var(--ox-text-muted)] pt-2 border-t border-[var(--ox-border)]">
              By continuing, you agree to OpportunityX's{' '}
              <a href="https://opportunityx.co.in/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Terms</a>
              {' & '}
              <a href="https://opportunityx.co.in/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Privacy Policy</a>.
            </div>
          </>
        )}
        </div>
      </div>
    </div>,
    document.body
  );
};
