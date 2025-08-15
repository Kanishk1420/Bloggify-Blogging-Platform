// Service Worker Registration for Avatar Caching

export const registerAvatarServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/avatar-sw.js', {
          scope: '/'
        });

        console.log('Avatar Service Worker registered successfully:', registration.scope);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('New avatar service worker found');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('New avatar service worker available');
                // Optionally notify user about update
              } else {
                console.log('Avatar service worker ready');
              }
            }
          });
        });

        // Set up periodic cache cleanup
        setInterval(() => {
          if (registration.active) {
            registration.active.postMessage({ type: 'CLEAN_CACHE' });
          }
        }, 24 * 60 * 60 * 1000); // Once per day

      } catch (error) {
        console.error('Avatar Service Worker registration failed:', error);
      }
    });
  }
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      if (registration.scope.includes('avatar') || registration.scriptURL.includes('avatar-sw.js')) {
        await registration.unregister();
        console.log('Avatar Service Worker unregistered');
      }
    }
  }
};