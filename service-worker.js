/* Sweden 2026 PWA — offline app shell（地圖底圖要訊號;行程/清單/緊急離線） */
const CACHE = 'sweden-v37';
const IMGS = ['lapporten','abiskocanyon','abiskojaure','alesjaure','salka','singi','kebnekaise','nikkaluokta','midnightsun','kungsleden','harads','volvo','saab','konstmuseum','trollhattan','ikea','haga','slottsskogen','vasa','nordiska','fjaderholmarna','fotografiska','avicii','skansen','gamlastan','monteliusvagen','stadshuset','nationalmuseum','stockholm'].map(n=>'./img/'+n+'.jpg');
const ASSETS = [
  './', './index.html', './data.js?v=37', './review.js?v=37', './app.js?v=37', './css/style.css?v=37', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png',
  'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js',
  'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css',
  ...IMGS
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(a => c.add(a)))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  // map tiles / routing = network only (唔 cache,要訊號)
  if (/openfreemap|tiles|osrm|basemaps|cartocdn/.test(u.host + u.pathname)) return;
  // 同源 app shell（HTML/JS/CSS/導航）= network-first：有訊號永遠攞最新,冇訊號 fallback cache
  const isShell = u.origin === location.origin &&
    (e.request.mode === 'navigate' || /\.(?:js|css|html)$/.test(u.pathname) || u.pathname === '/' || u.pathname.endsWith('/'));
  if (isShell) {
    e.respondWith(
      fetch(e.request).then(r => {
        if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
        return r;
      }).catch(() => caches.match(e.request).then(c => c || caches.match('./index.html')))
    );
    return;
  }
  // 圖片 / 字體 / libs = cache-first（慳數據·離線用）
  e.respondWith(
    caches.match(e.request).then(c => c || fetch(e.request).then(r => {
      if (e.request.method === 'GET' && r.ok && u.origin === location.origin) {
        const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp));
      }
      return r;
    }).catch(() => caches.match('./index.html')))
  );
});
