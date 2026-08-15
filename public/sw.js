const CACHE_NAME = 'ox-resume-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png'
];

// 1. Install Event — Pre-cache static shell assets & force immediate activation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll warning:', err);
      });
    })
  );
});

// 2. Activate Event — Clean up outdated caches & claim all clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event — Safe network/cache handling with zero unhandled rejections
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-http/https schemes (e.g. chrome-extension://, moz-extension://)
  if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) {
    return;
  }

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Bypass APIs, external CDNs, auth, databases, payments
  if (
    url.pathname.startsWith('/api') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('supabase') ||
    url.hostname.includes('cashfree') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('openrouter')
  ) {
    return;
  }

  // Navigation requests (HTML pages): Network-first with fallback to cached /index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match('/index.html') || await caches.match(request);
          return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }

  // Assets and other static resources
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update for cached asset
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const contentType = networkResponse.headers.get('content-type') || '';
              // Prevent caching SPA index.html fallbacks for JS/CSS assets
              if (!url.pathname.startsWith('/assets/') || !contentType.includes('text/html')) {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
              }
            }
          })
          .catch(() => {
            // Ignore background revalidation failure when offline
          });
        return cachedResponse;
      }

      // Network fetch with safe catch to prevent unhandled rejection
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const contentType = networkResponse.headers.get('content-type') || '';
            // Never cache HTML fallback responses for /assets/*.js files
            if (!url.pathname.startsWith('/assets/') || !contentType.includes('text/html')) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
          }
          return networkResponse;
        })
        .catch(() => {
          // Return a safe error response instead of rejecting the FetchEvent promise
          return new Response(null, { status: 408, statusText: 'Request timed out / offline' });
        });
    })
  );
});
