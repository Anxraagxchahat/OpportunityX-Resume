/**
 * OpportunityX Resume — Referral Attribution & Sharing Utility
 *
 * Handles:
 * 1. Immediate capture of ?ref=ABCDEF URL parameter before and after auth.
 * 2. Safe cross-session persistence in localStorage/sessionStorage.
 * 3. Canonical production referral URL generation (https://resume.opportunityx.co.in/?ref=ABCDEF).
 * 4. Native Web Share API integration with automatic clipboard fallback.
 */

const STORAGE_KEY = 'ox_pending_referral_code';
export const CANONICAL_PROD_URL = 'https://resume.opportunityx.co.in';

/**
 * Validates a referral code format: exactly 6 uppercase alphanumeric characters (A-Z, 0-9).
 */
export function isValidReferralCode(code) {
  if (!code || typeof code !== 'string') return false;
  const clean = code.trim().toUpperCase();
  return clean.length === 6 && /^[A-Z0-9]{6}$/.test(clean);
}

/**
 * Normalizes a referral code string.
 */
export function normalizeReferralCode(code) {
  if (!code || typeof code !== 'string') return '';
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
}

/**
 * Captures ?ref= or ?referral= query parameter from window.location.search
 * and persists it to storage so it survives page navigation and auth flows.
 */
export function captureReferralFromUrl() {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref') || params.get('referral') || params.get('r');

    if (refParam && isValidReferralCode(refParam)) {
      const normalized = normalizeReferralCode(refParam);
      localStorage.setItem(STORAGE_KEY, normalized);
      sessionStorage.setItem(STORAGE_KEY, normalized);
      return normalized;
    }
  } catch (e) {
    console.warn('[Referral] Failed to read/store URL referral parameter:', e);
  }
  return null;
}

/**
 * Retrieves the pending referral code if any exists in storage.
 */
export function getPendingReferralCode() {
  if (typeof window === 'undefined') return null;

  try {
    const code = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (code && isValidReferralCode(code)) {
      return normalizeReferralCode(code);
    }
  } catch (e) {
    return null;
  }
  return null;
}

/**
 * Clears the pending referral code after successful redemption or invalidation.
 */
export function clearPendingReferralCode() {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}

/**
 * Generates the canonical production share URL for a given referral code.
 */
export function getReferralShareUrl(referralCode) {
  if (!referralCode || !isValidReferralCode(referralCode)) return CANONICAL_PROD_URL;
  return `${CANONICAL_PROD_URL}/?ref=${normalizeReferralCode(referralCode)}`;
}

/**
 * Triggers native Web Share API where supported, or falls back to copying URL.
 */
export async function shareReferral(referralCode) {
  const url = getReferralShareUrl(referralCode);
  const shareData = {
    title: 'OpportunityX Resume',
    text: `Join OpportunityX Resume and get free AI credits! Use my referral link:`,
    url
  };

  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'share' };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, aborted: true };
      }
    }
  }

  // Fallback: Copy to clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      return { success: true, method: 'copy', url };
    } catch (clipErr) {
      console.warn('[Referral] Clipboard copy failed:', clipErr);
    }
  }

  return { success: false, method: 'none', url };
}
