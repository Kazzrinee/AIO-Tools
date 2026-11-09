// sw.js — service worker: cache aset inti, offline fallback.
const CACHE = 'aio-v13';
const ASSETS = [
  '/',
  '/index.html',
  '/tool.html',
  '/css/tokens.css',
  '/css/style.css',
  '/css/animations.css',
  '/css/pages.css',
  '/js/app.js',
  '/js/registry.js',
  '/js/consent.js',
  '/js/tools/util.js',
  '/js/tools/teks-1.js',
  '/js/tools/teks-2.js',
  '/js/tools/developer-1.js',
  '/js/tools/developer-2.js',
  '/js/tools/gambar-1.js',
  '/js/tools/gambar-2.js',
  '/js/tools/pdf-1.js',
  '/js/tools/pdf-2.js',
  '/js/tools/kalkulator-1.js',
  '/js/tools/kalkulator-2.js',
  '/js/tools/konverter-1.js',
  '/js/tools/konverter-2.js',
  '/js/tools/keamanan-1.js',
  '/js/tools/seo-1.js',
  '/js/tools/pelajar-1.js',
  '/js/tools/pelajar-2.js',
  '/js/tools/hiburan-1.js',
  '/js/tools/hiburan-2.js',
  '/js/tools/islami-1.js',
  '/js/tools/islami-2.js',
  '/assets/icons.svg',
  '/assets/favicon.svg',
  '/assets/logo.svg',
  '/manifest.json',
  '/pages/privacy.html',
  '/pages/terms.html',
  '/pages/refund.html',
  '/pages/cookie.html',
  '/pages/about.html',
  '/pages/contact.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (!res || res.status !== 200) return res;
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => {
        if (req.mode === 'navigate') return caches.match('/index.html');
      });
    })
  );
});