/**
 * OpportunityX Resume — Authentication Modal
 *
 * Production-grade authentication modal with real Firebase Auth:
 * - Google OAuth (signInWithPopup) with new-user referral detection
 * - GitHub OAuth (signInWithPopup) with new-user referral detection
 * - Email/Password (signInWithEmailAndPassword / createUserWithEmailAndPassword)
 * - Mandatory Email Verification (sendEmailVerification & verification polling)
 * - Referral Attribution Field (auto-filled from URL or manually entered)
 * - Password Reset (sendPasswordResetEmail)
 *
 * Continue-after-login: accepts onSuccess callback to resume interrupted actions.
 * Never writes to central OpportunityX user profiles.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Mail, LogIn, LogOut, Check, Eye, EyeOff,
  Loader2, AlertCircle, KeyRound, ArrowLeft,
  Gift, RefreshCw, CheckCircle2
} from 'lucide-react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  getAdditionalUserInfo,
  signOut
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { BrandLogo } from './common/BrandLogo';
import { normalizeProvider, getProviderLabel } from '../utils/authProviders';
import { trackAuthEvent, getAuthEventName } from '../utils/authAnalytics';
import { UserAvatar } from './UserAvatar';
import { apiService } from '../services/api';
import {
  getPendingReferralCode,
  clearPendingReferralCode,
  isValidReferralCode,
  normalizeReferralCode
} from '../utils/referralAttribution';

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

export const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { session } = useResume();

  const [mode, setMode] = useState(initialMode || 'login'); // 'login' | 'signup' | 'reset' | 'verify-email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState(() => getPendingReferralCode() || '');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProvider, setActiveProvider] = useState('');
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const authOpRef = useRef(false);
  const infoTimerRef = useRef(null);

  // Sync mode and referral code whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'login');
      const pending = getPendingReferralCode();
      if (pending) {
        setReferralCode(pending);
      }
    } else {
      setError('');
      setInfoMsg('');
      setSuccessMsg('');
      setIsSubmitting(false);
      setActiveProvider('');
      setIsCheckingVerification(false);
      authOpRef.current = false;
      if (infoTimerRef.current) clearTimeout(infoTimerRef.current);
    }
  }, [isOpen, initialMode]);

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleReferralChange = (val) => {
    const normalized = normalizeReferralCode(val);
    setReferralCode(normalized);
    if (normalized.length === 6) {
      localStorage.setItem('ox_pending_referral_code', normalized);
      sessionStorage.setItem('ox_pending_referral_code', normalized);
    }
  };

  const handleSuccess = (firebaseUser, extraSuccessMsg = '') => {
    setError('');
    setInfoMsg('');
    const baseWelcome = `Welcome, ${firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'}!`;
    setSuccessMsg(extraSuccessMsg ? `${baseWelcome} ${extraSuccessMsg}` : baseWelcome);

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
    }, 1000);
  };

  // Called when email verification succeeds
  const handleVerificationSuccess = useCallback(async (verifiedUser) => {
    setError('');
    setInfoMsg('');
    let bonusMsg = '';

    // Redeem referral code if present
    const codeToRedeem = referralCode || getPendingReferralCode();
    if (codeToRedeem && isValidReferralCode(codeToRedeem)) {
      try {
        const redeemRes = await apiService.redeemReferralCode(codeToRedeem);
        if (redeemRes && redeemRes.ok) {
          bonusMsg = '🎉 +5 Referral Credits added to your account!';
        }
      } catch (refErr) {
        console.warn('[Referral] Redemption note during verification:', refErr?.message);
      } finally {
        clearPendingReferralCode();
      }
    }

    handleSuccess(verifiedUser, bonusMsg);
  }, [referralCode, onSuccess, onClose]);

  // Live polling for email verification when in 'verify-email' mode
  useEffect(() => {
    if (mode !== 'verify-email' || !isOpen) return;

    const pollInterval = setInterval(async () => {
      try {
        if (auth.currentUser) {
          await auth.currentUser.reload();
          if (auth.currentUser.emailVerified) {
            clearInterval(pollInterval);
            await handleVerificationSuccess(auth.currentUser);
          }
        }
      } catch (err) {
        // Silently ignore background polling reload errors
      }
    }, 3500);

    return () => clearInterval(pollInterval);
  }, [mode, isOpen, handleVerificationSuccess]);

  if (!isOpen) return null;

  const showCancelNotice = (msg = 'Sign-in cancelled. You can try again anytime.') => {
    setError('');
    setInfoMsg(msg);
    if (infoTimerRef.current) clearTimeout(infoTimerRef.current);
    infoTimerRef.current = setTimeout(() => {
      setInfoMsg('');
    }, 3500);
  };

  const handleError = (firebaseError) => {
    const code = firebaseError?.code || '';
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return;
    }

    trackAuthEvent('auth_error', { code, message: firebaseError?.message });

    const msg = firebaseError?.message || '';
    if (msg.includes('redirect_uri') || (code === 'auth/invalid-credential' && activeProvider === 'github')) {
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
      'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
      'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.',
      'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
    };

    const rawMsg = firebaseError?.message || (typeof firebaseError === 'string' ? firebaseError : '');
    setError(errorMap[code] || rawMsg || 'Authentication failed. Please try again.');
  };

  const handleOAuthLogin = async (provider, providerInstance) => {
    if (authOpRef.current || isSubmitting) {
      return;
    }

    setError('');
    setInfoMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    setActiveProvider(provider);
    authOpRef.current = true;

    try {
      // If user had filled referral code in signup mode, ensure it is stored
      if (mode === 'signup' && referralCode && isValidReferralCode(referralCode)) {
        localStorage.setItem('ox_pending_referral_code', referralCode);
        sessionStorage.setItem('ox_pending_referral_code', referralCode);
      }

      const result = await signInWithPopup(auth, providerInstance);
      if (result && result.user) {
        const additionalInfo = getAdditionalUserInfo(result);
        const isNewUser = Boolean(additionalInfo?.isNewUser);

        let bonusMsg = '';
        if (isNewUser) {
          // Brand new user sign-up!
          const codeToRedeem = referralCode || getPendingReferralCode();
          if (codeToRedeem && isValidReferralCode(codeToRedeem)) {
            try {
              const redeemRes = await apiService.redeemReferralCode(codeToRedeem);
              if (redeemRes && redeemRes.ok) {
                bonusMsg = '🎉 +5 Referral Credits added to your account!';
              }
            } catch (refErr) {
              console.warn('[Referral] OAuth redemption note:', refErr?.message);
            } finally {
              clearPendingReferralCode();
            }
          }
        } else {
          // Existing user logging in: referral is strictly not granted
          clearPendingReferralCode();
        }

        handleSuccess(result.user, bonusMsg);
      }
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user') {
        showCancelNotice('Sign-in cancelled. You can try again anytime.');
      } else if (code === 'auth/cancelled-popup-request') {
        setError('');
      } else if (code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser. Please allow popups for this site and try again.');
      } else {
        handleError(err);
      }
    } finally {
      authOpRef.current = false;
      setIsSubmitting(false);
      setActiveProvider('');
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');
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
        // Save entered referral code if valid
        if (referralCode && isValidReferralCode(referralCode)) {
          localStorage.setItem('ox_pending_referral_code', referralCode);
          sessionStorage.setItem('ox_pending_referral_code', referralCode);
        }

        const result = await createUserWithEmailAndPassword(auth, cleanEmail, password);

        // Send real Firebase email verification
        try {
          await sendEmailVerification(result.user);
          setInfoMsg(`A verification link has been sent to ${cleanEmail}. Please click the link to activate your account.`);
        } catch (verifyErr) {
          console.error('[Auth] Failed to send verification email:', verifyErr);
          if (verifyErr.code === 'auth/too-many-requests') {
            setError('Too many verification emails requested. Please wait a few minutes before requesting another.');
          } else {
            setError(`Could not send verification email: ${verifyErr.message || verifyErr.code}`);
          }
        }

        setVerificationEmail(cleanEmail);
        setResendCooldown(60);
        setMode('verify-email');
      } else {
        const result = await signInWithEmailAndPassword(auth, cleanEmail, password);

        // Check mandatory email verification
        if (!result.user.emailVerified) {
          setVerificationEmail(cleanEmail);
          setMode('verify-email');
          setError('Your email is not verified yet. Please verify your email before logging in.');
          return;
        }

        handleSuccess(result.user);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
      setActiveProvider('');
    }
  };

  // Manual button: "I've Verified My Email"
  const handleManualCheckVerification = async () => {
    if (!auth.currentUser) {
      setError('Session expired. Please log in again.');
      setMode('login');
      return;
    }

    setIsCheckingVerification(true);
    setError('');
    setInfoMsg('');

    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        await handleVerificationSuccess(auth.currentUser);
      } else {
        setError('Email not verified yet. Please open the email sent to your inbox, click the verification link, and try again.');
      }
    } catch (err) {
      setError(err?.message || 'Failed to check verification status. Please try again.');
    } finally {
      setIsCheckingVerification(false);
    }
  };

  // Resend verification email button
  const handleResendVerification = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    if (!auth.currentUser) {
      setError('Session expired. Please log in again.');
      setMode('login');
      return;
    }

    setResendLoading(true);
    setError('');
    setInfoMsg('');

    try {
      await sendEmailVerification(auth.currentUser);
      setResendCooldown(60);
      setInfoMsg('A fresh verification email has been sent! Check your inbox and spam folder.');
    } catch (err) {
      if (err?.code === 'auth/too-many-requests') {
        setError('Too many requests. Firebase requires a short waiting period before sending another email.');
        setResendCooldown(120);
      } else {
        handleError(err);
      }
    } finally {
      setResendLoading(false);
    }
  };

  // "Use a different email / Back to signup"
  const handleBackFromVerification = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setError('');
    setInfoMsg('');
    setSuccessMsg('');
    setMode('signup');
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

  const handleModalClose = async () => {
    if (mode === 'verify-email' && auth.currentUser && !auth.currentUser.emailVerified) {
      try {
        await signOut(auth);
      } catch (e) {}
    }
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
              <BrandLogo
                variant="icon"
                size="w-9 h-9"
              />
            </div>
            <div className="truncate">
              <h3 className="text-base font-black text-[var(--ox-text-primary)] flex items-center gap-1 truncate">
                Opportunity<span className="text-orange-500">X</span> Account
              </h3>
              <p className="text-[11px] text-[var(--ox-text-secondary)] truncate">
                {mode === 'verify-email' ? 'Email Verification Required' : 'Central ecosystem authentication'}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleModalClose}
            disabled={isLoading || isCheckingVerification}
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
        {isAuthenticated && user && mode !== 'verify-email' && (
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

        {/* Info Notice */}
        {infoMsg && !error && !successMsg && (
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs text-orange-400 font-medium flex items-center justify-between gap-2 animate-fadeIn">
            <span>{infoMsg}</span>
            <button
              type="button"
              onClick={() => setInfoMsg('')}
              className="text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)] p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Error Notice */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notice */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* MODE: VERIFY EMAIL SCREEN */}
        {mode === 'verify-email' && (
          <div className="space-y-4 py-1">
            {/* Header Icon & Text */}
            <div className="text-center space-y-2.5">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto shadow-inner relative">
                <Mail className="w-7 h-7 text-orange-500 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500"></span>
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-black text-[var(--ox-text-primary)]">
                  Verify Your Email Address
                </h4>
                <p className="text-xs text-[var(--ox-text-secondary)]">
                  We've sent an activation link to:
                </p>
                <div className="p-2 rounded-xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] font-mono text-xs font-bold text-orange-400 max-w-xs mx-auto truncate select-all">
                  {verificationEmail || auth?.currentUser?.email || email}
                </div>
              </div>
            </div>

            {/* Verification Instructions */}
            <div className="p-3.5 rounded-2xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] space-y-2 text-xs text-[var(--ox-text-secondary)]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Open your inbox and click the verification link sent by OpportunityX.</span>
              </div>
              {isValidReferralCode(referralCode) && (
                <div className="flex items-start gap-2">
                  <Gift className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Referral code <strong className="font-mono text-orange-400">{referralCode}</strong> applied — <strong>+5 Free AI Credits</strong> will be added upon verification!</span>
                </div>
              )}
              <div className="text-[10px] text-[var(--ox-text-muted)] pt-1 border-t border-[var(--ox-border)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span>Auto-detecting verification... you can also click below once verified.</span>
              </div>
            </div>

            {/* Verification Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleManualCheckVerification}
                disabled={isCheckingVerification}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {isCheckingVerification ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking Status...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>I've Verified My Email</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendCooldown > 0 || resendLoading}
                className="w-full py-2.5 rounded-xl bg-[var(--ox-surface-primary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] text-xs font-bold text-[var(--ox-text-primary)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {resendLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                ) : (
                  <Mail className="w-3.5 h-3.5 text-orange-500" />
                )}
                <span>
                  {resendCooldown > 0
                    ? `Resend Email in ${resendCooldown}s`
                    : 'Resend Verification Email'}
                </span>
              </button>
            </div>

            {/* Google instant sign-in fallback */}
            <div className="pt-2 border-t border-[var(--ox-border)] text-center space-y-2">
              <p className="text-[11px] text-[var(--ox-text-muted)]">
                Have a Google account? Google accounts are pre-verified:
              </p>
              <button
                type="button"
                onClick={() => handleOAuthLogin('google', googleProvider)}
                disabled={isLoading}
                className="w-full py-2 rounded-xl bg-[var(--ox-surface-primary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] text-xs font-bold text-[var(--ox-text-primary)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <GoogleIcon />
                <span>Continue with Google (Instant Login)</span>
              </button>
            </div>

            {/* Back / Change Email Option */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleBackFromVerification}
                className="text-[11px] text-[var(--ox-text-muted)] hover:text-orange-500 font-medium transition-colors cursor-pointer"
              >
                Entered wrong email? <span className="underline font-bold">Use a different email</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE: LOGIN, SIGNUP, RESET */}
        {(!isAuthenticated || mode === 'verify-email') && mode !== 'verify-email' && (
          <>
            {/* Login Benefits */}
            <div className="p-3 rounded-xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] space-y-2">
              <span className="text-xs font-bold text-[var(--ox-text-secondary)]">Login gives you:</span>
              <div className="space-y-1.5 text-xs text-[var(--ox-text-secondary)]">
                {['Up to 5 Free Credits (via Social Tasks)', 'Full Access to AI Features', 'Cloud Backup & Recovery', 'Multi-device Resume Sync', 'Purchased Credits Storage'].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className={benefit.includes('Up to 5') ? 'font-semibold text-emerald-400' : ''}>{benefit}</span>
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

                  {/* Referral Code Field on Signup Mode */}
                  {mode === 'signup' && (
                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[var(--ox-text-secondary)] flex items-center gap-1.5">
                          <Gift className="w-3.5 h-3.5 text-orange-500" />
                          <span>Referral Code</span>
                          <span className="text-[10px] text-[var(--ox-text-muted)] font-normal">(Optional)</span>
                        </label>
                        {isValidReferralCode(referralCode) && (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> +5 Credits
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={referralCode}
                          onChange={(e) => handleReferralChange(e.target.value)}
                          placeholder="e.g. 6-character code"
                          maxLength={6}
                          disabled={isLoading}
                          className="w-full bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider text-[var(--ox-text-primary)] placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
                        />
                      </div>
                      {isValidReferralCode(referralCode) ? (
                        <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                          <span>🎉 Referral code applied! Both you and your friend will receive <strong>+5 free AI credits</strong> upon email verification.</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-[var(--ox-text-muted)]">
                          Got an invite from a friend? Enter their 6-character referral code here to claim +5 bonus credits.
                        </p>
                      )}
                    </div>
                  )}

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
                    {mode === 'signup' ? 'Create Account & Claim Up to 5 Credits' : 'Login & Continue'}
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
