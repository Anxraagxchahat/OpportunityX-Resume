/**
 * OpportunityX Resume — Authentication Analytics
 *
 * Lightweight auth event tracking hooks.
 * Non-blocking, optional. Events are dispatched as CustomEvents
 * for future analytics service integration.
 */

/**
 * Track an authentication event.
 * @param {'sign_in' | 'sign_up' | 'logout' | 'google_login' | 'github_login' | 'email_login' | 'guest_mode' | 'auth_error'} event
 * @param {Record<string, any>} metadata
 */
export function trackAuthEvent(event, metadata = {}) {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('ox_auth_event', {
          detail: {
            event,
            timestamp: new Date().toISOString(),
            product: 'resume',
            ...metadata,
          },
        })
      );
    }
  } catch (e) {
    // Analytics must never break the app
  }
}

/**
 * Map a normalized provider to an analytics event name.
 * @param {string} provider - Normalized provider from authProviders.js
 * @param {boolean} isNewUser - Whether this is a new registration
 * @returns {string}
 */
export function getAuthEventName(provider, isNewUser = false) {
  if (isNewUser) return 'sign_up';
  const map = {
    google: 'google_login',
    github: 'github_login',
    password: 'email_login',
    anonymous: 'guest_mode',
  };
  return map[provider] || 'sign_in';
}
