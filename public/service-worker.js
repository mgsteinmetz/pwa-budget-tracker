const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/dist/manifest.json',
    '/dist/newBudgetTracker.js',
    '/assets/css/style.css',
    '/assets/images/icons/icon-192x192.png',
    '/assets/images/icons/icon-512x512.png',
];

    const STATIC_CACHE = "static-cache-v1";
    const RUNTIME_CACHE = "runtime-cache";

    self.addEventListener("install", event => {
        event.waitUntil(
        caches
            .open(STATIC_CACHE)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
        );
    });

    self.addEventListener("activate", event => {
        const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
        event.waitUntil(
        caches
            .keys()
            .then(cacheNames => {
            return cacheNames.filter(
                cacheName => !currentCaches.includes(cacheName)
            );
            })
            .then(cachesToDelete => {
            return Promise.all(
                cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
                })
            );
            })
            .then(() => self.clients.claim())
        );
    });

    self.addEventListener("fetch", event => {
        if (
        event.request.method !== "GET" ||
        !event.request.url.startsWith(self.location.origin)
        ) {
        event.respondWith(fetch(event.request));
        return;
        }

        if (event.request.url.includes("/api/images")) {
        event.respondWith(
            caches.open(RUNTIME_CACHE).then(cache => {
            return fetch(event.request)
                .then(response => {
                cache.put(event.request, response.clone());
                return response;
                })
                .catch(() => caches.match(event.request));
            })
        );
        return;
        }

        event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
            return cachedResponse;
            }

            return caches.open(RUNTIME_CACHE).then(cache => {
            return fetch(event.request).then(response => {
                return cache.put(event.request, response.clone()).then(() => {
                return response;
                });
            });
            });
        })
        );
    });