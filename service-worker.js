const CACHE = 'sweden-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/days/day0.html',
  '/days/day1.html',
  '/days/day2.html',
  '/days/day3.html',
  '/days/day4.html',
  '/days/day5.html',
  '/days/day6.html',
  '/days/day7.html',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
