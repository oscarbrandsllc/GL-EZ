const CACHE_NAME = 'sleeper-tool-cache-v1.0.0-20251026';
const IMMUTABLE_ASSETS = [
  '/assets/',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
  '/scripts/syop.js',
  '/scripts/dh-scramble.js',
  '/scripts/loader-ring.js'
];
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './rosters/rosters.html',
  './stats/stats.html',
  './ownership/ownership.html',
  './analyzer/analyzer.html',
  './research/research.html',
  './styles/styles.css',
  './styles/stats.css',
  './scripts/app.js',
  './scripts/stats.js',
  './scripts/analyzer.js',
  './scripts/syop.js',
  './scripts/dh-scramble.js',
  './scripts/loader-ring.js'
];
self.addEventListener('install', e => { 
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(k => {
        if (k !== CACHE_NAME) {
          return caches.delete(k);
        }
      }))
    ).then(() => {
      self.clients.claim();
    })
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const isImmutable = IMMUTABLE_ASSETS.some(p => e.request.url.includes(p));
  if (isImmutable) {
    // Cache-First strategy for immutable assets (fonts, logos, specific scripts). Serve from cache immediately. If not found, fetch, cache, and return.
    e.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(e.request).then(response => {
          if (response) {
            return response;
          }
          return fetch(e.request).then(networkResponse => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    // Network-First strategy for dynamic content (API calls, HTML docs). Try network first to get fresh data, fall back to cache if offline.
    e.respondWith(
      fetch(e.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        return caches.match(e.request).then(cachedResponse => {
          if (!cachedResponse && e.request.mode === 'navigate') { // For failed HTML navigation, fall back to the root index.html
            return caches.match('./index.html');
          }
          return cachedResponse;
        });
      })
    );
  }
});
