/** Bump when precache/network strategy changes so old caches are dropped. */
const CACHE = "my-siblings-v6";

/** Precache static assets only — never freeze HTML/RSC/route data. */
const PRECACHE_URLS = ["/site.css"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  /**
   * Never cache dynamically:
   * - Next build/runtime assets
   * - Flight/RSC payloads and React Server PATCH streams
   * - REST handlers
   * - SW update checks
   * Stale caches here caused ChunkLoadError and broken navigations after deploy/HMR.
   */
  const isFlight =
    request.headers.get("RSC") === "1" ||
    request.headers.get("Next-Router-Prefetch") === "1" ||
    url.searchParams.has("_rsc");

  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/api/") ||
    url.pathname === "/sw.js" ||
    isFlight
  ) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    (async () => {
      if (
        url.origin === self.location.origin &&
        PRECACHE_URLS.includes(url.pathname)
      ) {
        const cached = await caches.match(request);
        if (cached) return cached;
      }
      return fetch(request);
    })()
  );
});
