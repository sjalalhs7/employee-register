const CACHE_NAME = 'msm-longroll-final-stable-v1';
const APP_SHELL = ['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET') return;
  event.respondWith(fetch(req).then(res=>{
    const copy=res.clone();
    if(new URL(req.url).origin===self.location.origin) caches.open(CACHE_NAME).then(c=>c.put(req,copy));
    return res;
  }).catch(()=>caches.match(req)));
});
