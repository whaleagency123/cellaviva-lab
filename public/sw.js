const CACHE_NAME = 'cellaviva-v1'
const STATIC_CACHE = 'cellaviva-static-v1'

// Pages to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/products',
  '/offline',
]

// ── Install: pre-cache shell pages ──────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch(() => {})
    ).then(() => self.skipWaiting())
  )
})

// ── Activate: clean up old caches ───────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

// ── Fetch: smart caching strategy ───────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET, cross-origin, and API/auth requests
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin')
  ) {
    return
  }

    // Never cache Next.js JS chunks — they change on every build
  if (url.pathname.startsWith('/_next/static/chunks/') ||
      url.pathname.startsWith('/_next/static/webpack/')) {
    return // Let browser handle directly, no service worker caching
  }

  // Static assets (CSS, fonts, images) → Cache-first
  if (
    url.pathname.startsWith('/_next/static/css/') ||
    url.pathname.startsWith('/_next/static/media/') ||
    url.pathname.startsWith('/uploads/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(png|jpg|jpeg|webp|avif|svg|ico|woff2|woff)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        if (cached) return cached
        const response = await fetch(request)
        if (response.ok) cache.put(request, response.clone())
        return response
      }).catch(() => caches.match(request))
    )
    return
  }

  // HTML pages → Network-first, fall back to cache, then offline page
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(async () => {
        const cached = await caches.match(request)
        if (cached) return cached
        const offline = await caches.match('/offline')
        return offline || new Response('You are offline.', { status: 503 })
      })
  )
})
