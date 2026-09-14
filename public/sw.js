// Dropzen Service Worker
const CACHE_NAME = 'dropzen-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // CRITICAL: NEVER intercept HTML page navigation requests!
  // Navigation requests must always load directly from the network
  // to prevent stale Next.js builds and infinite reload loops!
  if (event.request.mode === 'navigate') {
    return;
  }

  // NEVER intercept API, Next.js chunks, or HMR/hot-update requests
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('/api/') ||
    event.request.url.includes('/_next/') ||
    event.request.url.includes('hot-update') ||
    event.request.url.includes('__nextjs')
  ) {
    return;
  }

  // Network-first strategy for static assets
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith('http')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Support for native app badging
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_BADGE') {
    if (navigator.setAppBadge) {
      navigator.setAppBadge(event.data.count).catch(() => {});
    }
  } else if (event.data && event.data.type === 'CLEAR_BADGE') {
    if (navigator.clearAppBadge) {
      navigator.clearAppBadge().catch(() => {});
    }
  }
});
