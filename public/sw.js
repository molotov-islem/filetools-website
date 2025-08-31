const CACHE_NAME = "filetools-v1"
const STATIC_CACHE = "filetools-static-v1"
const DYNAMIC_CACHE = "filetools-dynamic-v1"

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/pdf-to-word",
  "/jpg-to-png",
  "/compress-pdf",
  "/images/filetools-logo.png",
  "/manifest.json",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker")
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("[SW] Static assets cached successfully")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("[SW] Failed to cache static assets:", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("[SW] Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("[SW] Service worker activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") return

  // Skip external requests
  if (url.origin !== location.origin) return

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone()
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
          .catch(() => {
            // Return offline page if available
            return caches.match("/")
          })
      }),
    )
    return
  }

  // Handle other requests (assets, API calls, etc.)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()

            // Determine which cache to use
            const cacheName = STATIC_ASSETS.includes(url.pathname) ? STATIC_CACHE : DYNAMIC_CACHE

            caches.open(cacheName).then((cache) => {
              cache.put(request, responseClone)
            })
          }

          return response
        })
        .catch((error) => {
          console.log("[SW] Fetch failed:", error)

          // Return fallback for images
          if (request.destination === "image") {
            return new Response(
              '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#6b7280">Image unavailable</text></svg>',
              { headers: { "Content-Type": "image/svg+xml" } },
            )
          }

          throw error
        })
    }),
  )
})

// Handle background sync for file processing
self.addEventListener("sync", (event) => {
  if (event.tag === "file-processing") {
    console.log("[SW] Background sync: file-processing")
    event.waitUntil(
      // Process queued file operations when back online
      processQueuedFiles(),
    )
  }
})

// Handle push notifications (for future use)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()
    console.log("[SW] Push notification received:", data)

    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/images/filetools-logo.png",
        badge: "/images/filetools-logo.png",
        tag: "filetools-notification",
      }),
    )
  }
})

// Utility function to process queued files
async function processQueuedFiles() {
  try {
    // This would integrate with your file processing logic
    console.log("[SW] Processing queued files...")
    // Implementation would depend on your specific file processing needs
  } catch (error) {
    console.error("[SW] Error processing queued files:", error)
  }
}
