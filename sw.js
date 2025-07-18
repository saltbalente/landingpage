const CACHE_NAME = 'amarres-amor-v1.0.0';
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/analytics.js',
  '/manifest.json',
  '/sitemap.xml',
  '/robots.txt',
  '/blog/amarres-de-amor-efectivos.html',
  '/blog/amarres-de-amor-que-funcionan.html',
  '/blog/amarres-de-amor-garantizados.html',
  '/blog/amarres-de-amor-rapidos.html',
  '/blog/amarres-de-amor-permanentes.html',
  '/blog/amarres-de-amor-eternos.html',
  '/blog/amarres-de-amor-para-mujeres.html',
  '/blog/amarres-de-amor-caseros.html',
  '/blog/amarres-de-amor-con-velas.html',
  '/blog/amarres-de-amor-con-miel.html',
  '/blog/amarres-de-amor-con-cristales.html',
  '/blog/amarres-de-amor-con-luna-llena.html',
  '/blog/amarres-de-amor-ancestrales.html',
  '/blog/chaman-amor-experto.html',
  '/blog/endulzamientos-enamorar.html',
  '/blog/rituales-amor-efectivos.html',
  '/blog/rituales-atraccion.html',
  '/blog/rituales-reconciliacion.html'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle offline form submissions
  return new Promise((resolve, reject) => {
    // Implementation for background sync
    resolve();
  });
}

// Push notifications (if needed)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nuevo contenido disponible sobre amarres de amor',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver más',
        icon: '/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Amarres de Amor Fuertes', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 