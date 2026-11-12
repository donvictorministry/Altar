/* sw.js - lets The Prayer App open offline.
   Change CACHE_NAME (for example to prayer-app-v2) every time you upload new files,
   so phones pick up the update. */
var CACHE_NAME = 'prayer-app-v4.3';

var FILES = [
  './',
  './index.html',
  './styles.css',
  './book.js',
  './lock.js',
  './icons.js',
  './cover-page.js',
  './qcode.js',
  './support-modal.js',
  './app.js',
  './notepad.js',
  './manifest.json'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (c) {
      /* One missing file must not stop the install, so each file is added on its own. */
      return Promise.all(FILES.map(function (f) { return c.add(f).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.filter(function (n) { return n !== CACHE_NAME; }).map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  /* Never touch the access-code server or any non-GET request. */
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) { return; }
  e.respondWith(
    fetch(req).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE_NAME).then(function (c) { c.put(req, copy); });
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) { return hit || caches.match('./index.html'); });
    })
  );
});
