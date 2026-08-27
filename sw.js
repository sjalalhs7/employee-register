const CACHE = 'msm-longroll-v3';
const CORE = ['./', './index.html', './manifest.webmanifest', './msm-logo-shield.jpg'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  const isNavigation = event.request.mode === 'navigate';
  event.respondWith(
    (isNavigation ? fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(c => c.put('./index.html', copy));
      return response;
    }) : caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(c => c.put(event.request, copy));
      return response;
    }))).catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))
  );
});
