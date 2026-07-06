const CACHE_NAME = 'wta-app-cache-v1';
const urlsToCache = [
    '/'
];

// Install the service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch data (allows basic offline support)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response; // Return cached version
            }
            return fetch(event.request); // Fetch from network
        })
    );
});