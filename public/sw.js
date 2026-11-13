/* Suppressor Studio service worker.
 * Cache only public, immutable assets and a static offline information page.
 * Do not cache HTML pages, auth sessions, account APIs, or customer data.
 */
const CACHE_NAME = "suppressor-studio-public-v1";
const OFFLINE_PAGE = "/offline.html";
const BOOT_FILES = [
  OFFLINE_PAGE,
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(BOOT_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((name) => name.startsWith("suppressor-studio-public-") && name !== CACHE_NAME)
        .map((name) => caches.delete(name)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const path = url.pathname;
  if (path.startsWith("/api/") || path.startsWith("/auth/")) return;

  // Never cache HTML: authenticated server-rendered output must remain private.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      return (await cache.match(OFFLINE_PAGE)) ?? Response.error();
    }));
    return;
  }

  const publicAsset = path.startsWith("/assets/") ||
    path.startsWith("/icons/") ||
    path === "/favicon.svg" ||
    path === "/manifest.webmanifest";
  if (!publicAsset) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const hit = await cache.match(request);
      if (hit) return hit;
      const response = await fetch(request);
      if (response.ok && response.type === "basic" && !response.headers.has("set-cookie")) {
        await cache.put(request, response.clone());
      }
      return response;
    })
  );
});
