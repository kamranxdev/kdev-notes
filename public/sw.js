const CACHE_NAME = 'kamranxdev-notes-v2';
const ASSETS_TO_CACHE = [
  '/',
];

// Install Event: Precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper functions for classification
function isIconRequest(url) {
  return (
    url.pathname.includes('favicon.svg') ||
    url.pathname.includes('favicon.ico') ||
    url.pathname.includes('icon-192.png') ||
    url.pathname.includes('icon-512.png')
  );
}

// Fetch Event: Cache strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests and same-origin requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Bypass service worker on localhost or for Next.js dev server HMR/hot-reload requests
  if (
    self.location.hostname === 'localhost' ||
    self.location.hostname === '127.0.0.1' ||
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.pathname.includes('turbopack-hmr') ||
    url.pathname.includes('-update.js') ||
    url.pathname.includes('-update.json')
  ) {
    return;
  }

  // 1. Bypass cache completely for favicons and app icons so updates appear instantly
  if (isIconRequest(url)) {
    event.respondWith(fetch(request));
    return;
  }

  // 2. API calls should ALWAYS be Network-First (never serve stale API data when online)
  if (url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseCopy);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // 3. For HTML documents/pages and Next.js RSC requests:
  // MUST BE NETWORK FIRST! Prevents returning visitors from seeing stale pages until manual refresh.
  const isNavigation =
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    (request.headers.get('accept') && request.headers.get('accept').includes('text/html'));

  const isRSC =
    request.headers.get('RSC') === '1' ||
    url.searchParams.has('_rsc') ||
    request.headers.has('Next-Router-State-Tree');

  if (isNavigation || isRSC) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseCopy);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          if (isNavigation) {
            return caches.match('/');
          }
        })
    );
    return;
  }

  // 4. Static Hashed Assets (/_next/static/*):
  // Safe for Cache-First because filenames contain unique build hashes and are immutable
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseCopy);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 5. For static local media (fonts, images): Stale-While-Revalidate with background cache refresh
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseCopy);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Silently fail network fetch if offline
        });

      return cachedResponse || fetchPromise;
    })
  );
});
