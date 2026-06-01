const CACHE_NAME = 'gridpreview-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/form_and_seek_logo.png',
  '/post_1.png',
  '/post_2.png',
  '/post_3.png',
  '/post_4.png',
  '/post_5.png',
  '/post_6.png',
  '/post_7.png',
  '/post_8.png'
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  (self as any).skipWaiting();
});

self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  (self as any).clients.claim();
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback for offline if resources are not found
      });
    })
  );
});
