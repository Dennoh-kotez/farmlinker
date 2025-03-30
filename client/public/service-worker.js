// Service Worker for FarmLinker PWA
const CACHE_NAME = 'farmlinker-cache-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index.css',
  '/assets/index.js',
  '/assets/logo.png'
];

// API routes to cache on fetch
const API_ROUTES = [
  '/api/products',
  '/api/categories'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper function to check if a request is for an API route
const isApiRoute = (url) => {
  return API_ROUTES.some(route => url.pathname.includes(route));
};

// Helper function to check if a request is for an image
const isImageRequest = (url) => {
  return url.pathname.match(/\.(jpg|jpeg|png|gif|svg)$/i);
};

// Helper function to determine caching strategy based on request
const getCacheStrategy = (request) => {
  const url = new URL(request.url);
  
  // For API routes: Network first, then cache
  if (isApiRoute(url)) {
    return 'network-first';
  }
  
  // For images: Cache first, then network
  if (isImageRequest(url)) {
    return 'cache-first';
  }
  
  // For everything else: Stale while revalidate
  return 'stale-while-revalidate';
};

// Fetch event - handle different caching strategies
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const strategy = getCacheStrategy(event.request);

  switch (strategy) {
    case 'network-first':
      // Network first, falling back to cache
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            // Store a copy of the response in cache
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
            return response;
          })
          .catch(() => {
            // If network fails, try to get from cache
            return caches.match(event.request);
          })
      );
      break;

    case 'cache-first':
      // Cache first, falling back to network
      event.respondWith(
        caches.match(event.request).then((response) => {
          return response || fetch(event.request).then((fetchResponse) => {
            // Store the fetched response in cache
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
            });
            return fetchResponse;
          });
        })
      );
      break;

    case 'stale-while-revalidate':
    default:
      // Stale-while-revalidate: Respond with cached version if available,
      // but fetch an update for next time
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              // Update the cache
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
              return networkResponse;
            })
            .catch(() => {
              // If network fails completely, still return cached version
              return cachedResponse;
            });
          
          // Return the cached response immediately, or wait for network if nothing in cache
          return cachedResponse || fetchPromise;
        })
      );
      break;
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-icon.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data.url;
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If no open window, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  } else if (event.tag === 'sync-products') {
    event.waitUntil(syncProducts());
  }
});

// Function to sync offline orders
async function syncOrders() {
  try {
    // Get cached orders that need to be synced
    const db = await openDB();
    const offlineOrders = await db.getAll('offlineOrders');
    
    for (const order of offlineOrders) {
      try {
        // Try to send to server
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order),
        });
        
        if (response.ok) {
          // If successful, remove from offline store
          await db.delete('offlineOrders', order.id);
        }
      } catch (error) {
        console.error('Error syncing order:', error);
        // Keep in offline store for next sync attempt
      }
    }
  } catch (error) {
    console.error('Error in order sync:', error);
  }
}

// Function to sync offline product changes
async function syncProducts() {
  try {
    // Get cached product changes that need to be synced
    const db = await openDB();
    const offlineProducts = await db.getAll('offlineProducts');
    
    for (const product of offlineProducts) {
      try {
        // Try to send to server
        const response = await fetch(`/api/products/${product.id}`, {
          method: product.method, // 'PUT', 'POST', etc.
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product.data),
        });
        
        if (response.ok) {
          // If successful, remove from offline store
          await db.delete('offlineProducts', product.id);
        }
      } catch (error) {
        console.error('Error syncing product:', error);
        // Keep in offline store for next sync attempt
      }
    }
  } catch (error) {
    console.error('Error in product sync:', error);
  }
}

// Simple IndexedDB interface for offline data
async function openDB() {
  return new Promise((resolve, reject) => {
    const dbName = 'farmlinker-offline';
    const request = indexedDB.open(dbName, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create stores for offline data
      if (!db.objectStoreNames.contains('offlineOrders')) {
        db.createObjectStore('offlineOrders', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('offlineProducts')) {
        db.createObjectStore('offlineProducts', { keyPath: 'id' });
      }
    };
  });
}