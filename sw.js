const CACHE_NAME = 'inflacion-mx-v11';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/estyle.css',
  './css/laptop.css',
  './css/desktop.css',
  './config.js',
  './i18n.js',
  './calculos.js',
  './manifest.json',
  './icons/icon.jpg',
  './meses/enero.js',
  './meses/feb.js',
  './meses/marzo.js',
  './meses/abril.js',
  './meses/mayo.js',
  './meses/junion.js',
  './meses/julio.js',
  './meses/agosto.js',
  './meses/sep.js',
  './meses/oct.js',
  './meses/nov.js',
  './meses/dic.js'
];

// Instalar el Service Worker y almacenar recursos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activar y limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones para el modo Offline
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // 1. Peticiones a la API de Netlify (Banxico) -> Network First
  if (requestUrl.pathname.includes('/.netlify/functions/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Fallo de red (Offline). Retornamos error 503.
          // El bloque catch en calculos.js atrapará esto y activará el fallback local.
          return new Response(JSON.stringify({ error: "Offline mode active" }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // 2. Archivos estáticos -> Cache First con Network Fallback
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Retorna desde caché local inmediatamente
        }
        return fetch(event.request); // Si no está en caché, lo busca en internet
      })
  );
});
