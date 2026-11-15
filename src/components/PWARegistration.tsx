"use client";

import { useEffect } from 'react';

/**
 * Service Worker Uninstaller & Cache Cleaner:
 * Cleans up and unregisters any active service workers and legacy
 * CacheStorage data left behind in visitors' browsers, restoring standard
 * native HTTP caching behavior.
 */
export default function PWARegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Unregister all existing service workers
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((unregistered) => {
          if (unregistered) {
            console.log('[PWA] Unregistered active service worker:', registration.scope);
          }
        });
      }
    });

    // Clear all CacheStorage instances from previous versions
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const key of keys) {
          caches.delete(key).then(() => {
            console.log('[PWA] Purged legacy cache:', key);
          });
        }
      });
    }
  }, []);

  return null;
}
