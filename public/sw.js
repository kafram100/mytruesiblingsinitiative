/** Bump when precache/network strategy changes so old caches are dropped. */
const CACHE = "my-siblings-v5";

/** Precache static assets only — never freeze HTML for `/`; it breaks fresh JS/UI. */
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
   * Never cache Next.js build output or the image optimizer. Caching `/_next/*`
   * caused stale client chunks vs fresh SSR HTML (React hydration mismatches on
   * className, sizes, etc.) after deploys or local iteration.
   */
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname === "/sw.js" ||
    url.pathname.startsWith("/sw.js")
  ) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    (async () => {
      // Always go to network for navigations — full document must have latest markup & scripts.
      if (request.mode === "navigate") {
        return fetch(request);
      }

      const cached = await caches.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    })()
  );
});
