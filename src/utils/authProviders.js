/**
 * OpportunityX Resume — Authentication Provider Normalization
 *
 * Normalizes raw Firebase provider IDs to clean internal identifiers.
 * Future-proof for Apple Sign-In, Phone Auth, Magic Links, Passkeys.
 */

export const PROVIDERS = Object.freeze({
  GOOGLE: 'google',
  GITHUB: 'github',
  PASSWORD: 'password',
  ANONYMOUS: 'anonymous',
  // Future
  // APPLE: 'apple',
  // PHONE: 'phone',
  // MAGIC_LINK: 'magic_link',
  // PASSKEY: 'passkey',
});

const FIREBASE_PROVIDER_MAP = {
  'google.com': PROVIDERS.GOOGLE,
  'github.com': PROVIDERS.GITHUB,
  'password': PROVIDERS.PASSWORD,
  'anonymous': PROVIDERS.ANONYMOUS,
  // Future mappings
  // 'apple.com': PROVIDERS.APPLE,
  // 'phone': PROVIDERS.PHONE,
};

/**
 * Extract the normalized provider name from a Firebase user object.
 * @param {import('firebase/auth').User | null} firebaseUser
 * @returns {string} Normalized provider identifier
 */
export function normalizeProvider(firebaseUser) {
  if (!firebaseUser) return PROVIDERS.ANONYMOUS;

  const primaryProvider = firebaseUser.providerData?.[0]?.providerId;
  if (primaryProvider && FIREBASE_PROVIDER_MAP[primaryProvider]) {
    return FIREBASE_PROVIDER_MAP[primaryProvider];
  }

  // Fallback: if user is anonymous or provider is unrecognized
  if (firebaseUser.isAnonymous) return PROVIDERS.ANONYMOUS;

  return primaryProvider || PROVIDERS.ANONYMOUS;
}

/**
 * Get a human-readable label for a provider.
 * @param {string} normalizedProvider
 * @returns {string}
 */
export function getProviderLabel(normalizedProvider) {
  const labels = {
    [PROVIDERS.GOOGLE]: 'Google',
    [PROVIDERS.GITHUB]: 'GitHub',
    [PROVIDERS.PASSWORD]: 'Email',
    [PROVIDERS.ANONYMOUS]: 'Guest',
  };
  return labels[normalizedProvider] || normalizedProvider;
}
