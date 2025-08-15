/**
 * Optimized avatar utility for Bloggify
 * Uses caching, lazy loading, and performance optimizations
 */

// Default avatar from the API
export const DEFAULT_AVATAR = 'https://avatar.iran.liara.run/public';

// Cache for preloaded images
const imageCache = new Map();
const preloadPromises = new Map();

// Get a random avatar with caching (generates a consistent random avatar based on user)
export const getRandomAvatar = (userId = null) => {
  if (userId) {
    // Generate a consistent "random" avatar based on user ID
    const avatarId = (parseInt(userId.slice(-2), 16) % 100) + 1;
    return `${DEFAULT_AVATAR}/${avatarId}`;
  }
  // For true random generation (only when explicitly requested)
  const randomId = Math.floor(Math.random() * 100) + 1;
  return `${DEFAULT_AVATAR}/${randomId}`;
};

// Get a specific avatar by ID with caching
export const getAvatarById = (id) => {
  const avatarId = Math.min(Math.max(parseInt(id) || 1, 1), 100);
  return `${DEFAULT_AVATAR}/${avatarId}`;
};

// Preload an image and cache it
export const preloadImage = (url) => {
  if (imageCache.has(url)) {
    return Promise.resolve(imageCache.get(url));
  }

  if (preloadPromises.has(url)) {
    return preloadPromises.get(url);
  }

  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      imageCache.set(url, img);
      preloadPromises.delete(url);
      resolve(img);
    };
    
    img.onerror = () => {
      preloadPromises.delete(url);
      reject(new Error(`Failed to load image: ${url}`));
    };
    
    // Add crossorigin attribute for better caching
    img.crossOrigin = 'anonymous';
    img.src = url;
  });

  preloadPromises.set(url, promise);
  return promise;
};

// Batch preload multiple images with concurrency control
export const batchPreloadImages = async (urls, maxConcurrent = 6) => {
  const results = [];
  const executing = [];

  for (const url of urls) {
    const promise = preloadImage(url).catch(err => ({ url, error: err }));
    results.push(promise);

    if (urls.length >= maxConcurrent) {
      executing.push(promise);

      if (executing.length >= maxConcurrent) {
        await Promise.race(executing);
        executing.splice(executing.findIndex(p => p === promise), 1);
      }
    }
  }

  return Promise.allSettled(results);
};

// Create array of all available avatars (increased to 100)
export const getAllAvatars = () => {
  const avatars = [];
  for (let i = 1; i <= 100; i++) {
    avatars.push({
      id: i,
      url: getAvatarById(i)
    });
  }
  return avatars;
};

// Get avatars for a specific page with preloading
export const getAvatarsForPage = (page = 1, perPage = 24) => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const allAvatars = getAllAvatars();
  
  const pageAvatars = allAvatars.slice(startIndex, endIndex);
  
  // Preload current page images
  const currentPageUrls = pageAvatars.map(avatar => avatar.url);
  batchPreloadImages(currentPageUrls);
  
  // Preload next page images in the background
  if (endIndex < allAvatars.length) {
    const nextPageAvatars = allAvatars.slice(endIndex, endIndex + perPage);
    const nextPageUrls = nextPageAvatars.map(avatar => avatar.url);
    setTimeout(() => batchPreloadImages(nextPageUrls), 500);
  }
  
  return pageAvatars;
};

// Check if image is cached
export const isImageCached = (url) => {
  return imageCache.has(url);
};

// Clear cache (useful for memory management)
export const clearImageCache = () => {
  imageCache.clear();
  preloadPromises.clear();
};

// Get cache size for debugging
export const getCacheInfo = () => {
  return {
    cachedImages: imageCache.size,
    pendingPreloads: preloadPromises.size
  };
};