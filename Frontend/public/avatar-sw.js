// Service Worker for Avatar Caching
const CACHE_NAME = 'avatar-cache-v1';
const AVATAR_API_BASE = 'https://avatar.iran.liara.run/public';

// Install event
self.addEventListener('install', () => {
  console.log('Avatar Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Avatar Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Fetch event - intercept avatar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Only handle avatar API requests
  if (request.url.includes(AVATAR_API_BASE)) {
    event.respondWith(handleAvatarRequest(request));
  }
});

async function handleAvatarRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Try to get from cache first
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Return cached version immediately
      console.log('Serving avatar from cache:', request.url);
      
      // Try to update cache in background (stale-while-revalidate)
      updateCacheInBackground(request, cache);
      
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    console.log('Fetching avatar from network:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone the response before caching
      const responseClone = networkResponse.clone();
      
      // Add to cache with expiration headers
      const responseWithHeaders = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: {
          ...Object.fromEntries(responseClone.headers),
          'Cache-Control': 'public, max-age=86400', // 24 hours
          'Cached-At': Date.now().toString()
        }
      });
      
      cache.put(request, responseWithHeaders.clone());
      return networkResponse;
    }
    
    throw new Error('Network response was not ok');
    
  } catch (error) {
    console.error('Error handling avatar request:', error);
    
    // Try to serve stale cached version as fallback
    const staleResponse = await cache.match(request);
    if (staleResponse) {
      console.log('Serving stale avatar from cache:', request.url);
      return staleResponse;
    }
    
    // Return a simple fallback image or error
    return new Response('Avatar not available', { status: 404 });
  }
}

async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseWithHeaders = new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: {
          ...Object.fromEntries(networkResponse.headers),
          'Cache-Control': 'public, max-age=86400',
          'Cached-At': Date.now().toString()
        }
      });
      
      cache.put(request, responseWithHeaders);
      console.log('Updated cache in background for:', request.url);
    }
  } catch (error) {
    console.log('Background update failed for:', request.url, error);
  }
}

// Clean up old cache entries periodically
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    cleanOldCacheEntries();
  }
});

async function cleanOldCacheEntries() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  const now = Date.now();
  const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const cachedAt = response.headers.get('Cached-At');
      if (cachedAt && (now - parseInt(cachedAt)) > MAX_AGE) {
        await cache.delete(request);
        console.log('Cleaned old cache entry:', request.url);
      }
    }
  }
}