/**
 * PWA Service Worker Registration Utility
 * Registers /sw.js in production or HTTPS environments safely without blocking main thread.
 * Cleanly unregisters during local development to prevent stale HMR caching.
 */

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Only register service worker in production to avoid interfering with Vite HMR in dev
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister();
      }
    });
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Check for updates on page load
        registration.update().catch(() => {});

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('[PWA] New version ready.');
              }
            }
          };
        };
      })
      .catch((error) => {
        console.warn('[PWA] ServiceWorker registration warning:', error);
      });
  });
}

/**
 * Check if the application is running in Standalone PWA mode
 */
export function isStandalonePWA() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true
  );
}
