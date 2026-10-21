/**
 * MediFind / Dawaak - Service Worker (Offline-First Mesh Cache)
 * شبكة الصمود غير المتصل لقطاع غزة - كاش محلي فوري
 */

const CACHE_NAME = 'dawaak-gaza-v3.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './index_patient.html',
  './index_pharmacy.html',
  './index_admin.html',
  './delivery.html',
  './about.html',
  './features.html',
  './how_it_works.html',
  './contact.html',
  './contact_us.html',
  './dashboard-ui.css',
  './dashboard-ui.js',
  './public-nav.css',
  './js/public-nav.js',
  './js/store.js',
  './js/tracker.js',
  './assets/css/core.css',
  './assets/images/dawaak-logo.png',
  './assets/images/dawaak-logo.webp',
  './assets/images/medifind-hero.webp',
  './assets/images/dawaak-family-hero.webp',
  './assets/images/dawaak-pharmacy-hero.webp',
  './assets/images/patient-pharmacy-hero.webp',
  './assets/images/medifind-delivery.webp',
  './assets/images/about-platform-hero.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some assets failed to precache during install:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Cache First with Network Fallback strategy
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip non-GET requests and chrome-extension
  if (event.request.method !== 'GET' || !requestUrl.protocol.startsWith('http')) {
    return;
  }

  // Skip API sync requests so they go directly to server or fallback
  if (requestUrl.pathname.includes('api.php')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to revalidate cache if online
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for HTML navigation
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
