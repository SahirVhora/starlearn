// StarLearn - Service Worker
// Cache-first strategy for full offline support

const CACHE_NAME = 'starlearn-v1';

const STATIC_ASSETS = [
  '/starlearn/',
  '/starlearn/index.html',
  '/starlearn/app.js',
  '/starlearn/questions.js',
  '/starlearn/questions-11plus.js',
  '/starlearn/preview.svg',
  '/starlearn/manifest.json'
];

// ── Install: cache all static assets ─────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('SW: Some assets failed to cache during install', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ─────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first strategy ───────────────────────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  // Skip OpenRouter API calls - always go to network
  if (event.request.url.includes('openrouter.ai')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (!response || response.status !== 200) return response;

        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/starlearn/index.html');
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
