/**
 * OpportunityX Resume — Ecosystem Authentication Manager
 * Handles Email Login, Google OAuth, GitHub OAuth, and Anonymous Guest Mode.
 */

const SESSION_KEY = 'opportunityx_user_session_v1';
const WELCOME_CREDITS_PREFIX = 'ox_welcome_credits_claimed_';

export function getCurrentUserSession() {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.isAuthenticated && parsed.user?.id) {
        return parsed;
      }
    }
  } catch (e) {}

  // Default Guest Mode Session (Unauthenticated, Free Resume Builder)
  return {
    isAuthenticated: false,
    isGuest: true,
    user: null,
    mode: 'Guest Mode'
  };
}

export function hasUserClaimedWelcomeCredits(userId) {
  if (!userId) return false;
  try {
    return localStorage.getItem(`${WELCOME_CREDITS_PREFIX}${userId}`) === 'true';
  } catch (e) {
    return false;
  }
}

export function markWelcomeCreditsClaimed(userId) {
  if (!userId) return;
  try {
    localStorage.setItem(`${WELCOME_CREDITS_PREFIX}${userId}`, 'true');
  } catch (e) {}
}

export function loginUser(email, provider = 'Email') {
  const sanitizedEmail = (email || '').trim().toLowerCase();
  const userId = `ox-user-${sanitizedEmail.replace(/[^a-z0-9]/g, '_') || Date.now()}`;
  const isFirstClaim = !hasUserClaimedWelcomeCredits(userId);

  const session = {
    isAuthenticated: true,
    isGuest: false,
    user: {
      id: userId,
      name: sanitizedEmail.split('@')[0] || 'User',
      email: sanitizedEmail,
      provider,
      avatarUrl: null
    },
    mode: 'Authenticated',
    isFirstClaim
  };

  if (isFirstClaim) {
    markWelcomeCreditsClaimed(userId);
  }

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {}

  return session;
}

export function logoutUser() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {}
  return getCurrentUserSession();
}

