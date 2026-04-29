const CACHE_NAME = 'peep-v1';
const urlToCache =[
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
];

self.addEventListener('install' function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            return.cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
