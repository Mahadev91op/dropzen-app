'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // In development mode (localhost), unregister any active service worker
    // to prevent Turbopack/HMR infinite auto-refresh loops!
    if (process.env.NODE_ENV !== 'production' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      }).catch(() => {});

      if ('caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        }).catch(() => {});
      }
      return;
    }

    // Only register service worker in production builds
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => {
        console.warn('PWA registration skipped:', err?.message || err);
      });
  }, []);

  return null;
}
