"use client";

import { useEffect } from 'react';

export default function PWARegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      if (process.env.NODE_ENV === 'development') {
        // Unregister service worker in development mode to avoid dev chunks / HMR caching issues
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().then((success) => {
              if (success) {
                console.log('Successfully unregistered service worker for development mode');
              }
            });
          }
        });
        return;
      }

      const registerSW = async () => {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered successfully:', reg.scope);

          // Actively check for service worker updates
          reg.update();

          // Check for updates when user returns to tab
          const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
              reg.update();
            }
          };

          document.addEventListener('visibilitychange', handleVisibilityChange);

          return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
          };
        } catch (err) {
          console.error('Service Worker registration failed:', err);
        }
      };

      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
        return () => window.removeEventListener('load', registerSW);
      }
    }
  }, []);

  return null;
}
