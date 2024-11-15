const CACHE_NAME = 'date-calculator-cache-v2'; // Updated cache version to force cache refresh
const urlsToCache = [
  '/date/calculator.html',
  '/date/date.css',
  '/date/date.js',
  '/date/logo.png'
];

// Install event - cache the assets
self.addEventListener('install', (event) => {
  self.skipWaiting();  // Force the new service worker to take control immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - always try to fetch the latest content first, fallback to cache if network fails
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);  // Serve from cache if network is unavailable
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];  // Keep the latest cache version
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);  // Delete outdated caches
          }
        })
      );
    })
  );
});
