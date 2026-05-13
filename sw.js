// TripCraft Service Worker
// Caches the app shell for offline use and fast loading

const CACHE_NAME = 'tripcraft-v1';

// Resources to cache on install
// The app itself is the main asset — everything else is loaded from CDN
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// CDN assets to cache when first fetched (runtime caching)
const CDN_ORIGINS = [
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

// ── Install: cache core app assets ───────────────────────────
self.addEventListener('install', event => {
  console.log('[TripCraft SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[TripCraft SW] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.log('[TripCraft SW] Cache failed:', err))
  );
});

// ── Activate: clean up old caches ────────────────────────────
self.addEventListener('activate', event => {
  console.log('[TripCraft SW] Activating...');
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[TripCraft SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: serve from cache, fall back to network ─────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Never intercept API calls — always go to network
  const isAPICall = 
    url.hostname === 'api.anthropic.com' ||
    url.hostname.includes('ollama') ||
    url.hostname === 'nominatim.openstreetmap.org' ||
    url.hostname === 'api.frankfurter.app' ||
    url.hostname === 'api.open-meteo.com' ||
    url.hostname === 'tile.openstreetmap.org';

  if(isAPICall) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For CDN assets (Leaflet, fonts): cache-first, update in background
  const isCDN = CDN_ORIGINS.some(origin => url.hostname.includes(origin));
  if(isCDN) {
    event.respondWith(
      caches.match(event.request)
        .then(cached => {
          const networkFetch = fetch(event.request)
            .then(response => {
              if(response && response.status === 200) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
              }
              return response;
            })
            .catch(() => null);
          return cached || networkFetch;
        })
    );
    return;
  }

  // For app files: cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if(cached) return cached;
        return fetch(event.request)
          .then(response => {
            if(!response || response.status !== 200 || response.type === 'opaque') {
              return response;
            }
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            return response;
          })
          .catch(() => {
            // Offline fallback — return the cached index.html
            if(event.request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
});
