const CACHE_NAME = 'kamranxdev-notes-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

// Install Event: Precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache and caching shell assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests and same-origin requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // API calls should bypass service worker cache
  // Bypass service worker on localhost or for Next.js dev server HMR/hot-reload requests
  if (
    self.location.hostname === 'localhost' ||
    self.location.hostname === '127.0.0.1' ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.pathname.includes('turbopack-hmr') ||
    url.pathname.includes('-update.js') ||
    url.pathname.includes('-update.json')
  ) {
    return;
  }

  // For HTML documents/pages: Stale-While-Revalidate (Instant Offline-First + Background Update)
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseCopy);
            });
          }
          return networkResponse;
        });

        if (cachedResponse) {
          // Serve from cache immediately; fetch fresh content in the background
          fetchPromise.catch(() => { /* Silently catch background errors if offline */ });
          return cachedResponse;
        }

        // If not in cache, wait for the network response
        return fetchPromise.catch(() => {
          // Completely offline and page not cached: fallback to root '/'
          return caches.match('/');
        });
      })
    );
    return;
  }

  // For static assets (JS, CSS, fonts, local images): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          const responseCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseCopy);
          });
        }
        return networkResponse;
      });

      if (cachedResponse) {
        // Run fetch in background to update cache, catching errors silently
        fetchPromise.catch(() => {
          // Silently fail network fetch if offline
        });
        return cachedResponse;
      }

      // If not in cache, return the direct fetch promise (errors propagate naturally)
      return fetchPromise;
    })
  );
});
