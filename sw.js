const CACHE_NAME = 'premium-vault-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './src/secure.png',
  './src/secure.png'
];

// Instalasi Service Worker dan menyimpan file ke Cache Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('File berhasil di-cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Menghapus Cache lama jika ada pembaruan versi (v2, v3, dst)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Menangkap permintaan jaringan dan mengembalikan data dari Cache jika offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, kembalikan file tersebut. Jika tidak, ambil dari internet.
        return response || fetch(event.request);
      })
  );
});
