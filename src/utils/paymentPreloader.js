/**
 * Payment Performance Preloader & Backend Warm-Up Utility
 * 
 * Performs non-blocking background pings to wake up Render backend instances
 * and preloads Cashfree Web SDK scripts before user interacts with payment UI.
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://opportunityx-resume.onrender.com/api/v1').replace(/\/api\/v1\/?$/, '');

let lastPingTime = 0;
const PING_THROTTLE_MS = 120000; // 2 minutes throttle lock

/**
 * Silently pings backend health endpoints to trigger Render instance wake-up
 */
export const pingBackendWarmup = () => {
  const now = Date.now();
  if (now - lastPingTime < PING_THROTTLE_MS) {
    return; // Throttled to avoid excessive requests
  }
  lastPingTime = now;

  // Non-blocking fetch to root /health and /api/v1/health/warmup
  const healthUrl = `${API_BASE}/health`;
  
  if (typeof window !== 'undefined' && window.fetch) {
    fetch(healthUrl, { method: 'GET', mode: 'cors', credentials: 'omit' })
      .then((res) => {
        if (res.ok) {
          console.debug('[WarmUp] Render backend awake & ready.');
        }
      })
      .catch(() => {
        // Silently swallow errors — warm-up is best-effort
      });
  }
};

/**
 * Silently preloads Cashfree Web SDK v3 script in document head
 */
export const preloadCashfreeSDK = () => {
  if (typeof window === 'undefined' || window.Cashfree) return;

  const scriptId = 'cashfree-sdk-v3-preloader';
  if (document.getElementById(scriptId)) return;

  const script = document.createElement('script');
  script.id = scriptId;
  script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
  script.async = true;
  script.onload = () => {
    console.debug('[Preloader] Cashfree Payment SDK preloaded successfully.');
  };
  script.onerror = () => {
    // Ignore script load failure on preload — will retry on checkout
  };
  document.head.appendChild(script);
};

/**
 * Initializes all non-blocking payment preloading tasks
 */
export const initPaymentPreloader = () => {
  pingBackendWarmup();
  preloadCashfreeSDK();
};
