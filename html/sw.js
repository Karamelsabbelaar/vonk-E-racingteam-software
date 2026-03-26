/**
 * KartPit — Service Worker
 * Cache-first for all static assets, network-only for Supabase API.
 */

const CACHE = 'kartpit-v2';

const STATIC = [
  './',
  'index.html',
  'agenda.html',
  'checklist.html',
  'pitstop.html',
  'tracks.html',
  'takenlijst.html',
  'rondetijd.html',
  'handleiding.html',
  'rijdag.html',
  'login.html',
  'admin.html',
  'favicon.svg',
  'css/style.css',
  'js/main.js',
  'js/auth-guard.js',
  'js/supabase.config.js',
  'js/offline.js',
  'js/checklist.js',
  'js/timer.js',
  'js/rondetijd.js',
  'js/tirepressure.js',
  'js/notifications.js',
  'js/lib/supabase.min.js',
  'js/lib/capacitor.min.js',
  'images/Vonk-Logo.png',
  'images/Vonk-Logo-dark.png',
  'fonts/bebas-neue-400.woff2',
  'fonts/barlow-condensed-300.woff2',
  'fonts/barlow-condensed-400.woff2',
  'fonts/barlow-condensed-600.woff2',
  'fonts/barlow-condensed-700.woff2',
  'fonts/barlow-300.woff2',
  'fonts/barlow-400.woff2',
  'fonts/barlow-500.woff2',
];

// Install — pre-cache everything
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(STATIC))
      .then(() => self.skipWaiting())
  );
});

// Activate — remove old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — strategy depends on request type
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // Network-only for Supabase live API calls (data must always be fresh)
  if (url.hostname.includes('supabase.co')) return;

  // Cache-first for everything else (pages, CSS, JS, images, CDN assets)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        // Serve from cache immediately, refresh in background
        const refresh = fetch(e.request).then(res => {
          if (res && res.ok) {
            caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          }
          return res;
        }).catch(() => {});
        void refresh;
        return cached;
      }

      // Not in cache yet — fetch, cache, return
      return fetch(e.request).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
