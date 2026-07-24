const CACHE_NAME = "wta-app-cache-v2";

// Install
self.addEventListener("install", event => {
    self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );

    self.clients.claim();
});

// Network First Strategy
self.addEventListener("fetch", event => {

    // Only cache GET requests
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {

                // Save a copy in cache
                const responseClone = networkResponse.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });

                return networkResponse;
            })
            .catch(() => {
                // Offline → use cache if available
                return caches.match(event.request);
            })
    );
});