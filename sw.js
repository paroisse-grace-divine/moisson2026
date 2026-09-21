const CACHE = "moisson-2026-v13";
const ASSETS = [
  "./index.html",
  "./styles.css",
  "./app.js",
  "./config.js",
  "./manifest.webmanifest",
  "./assets/favicon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/harvest-detail.jpg",
  "./assets/hero-moisson-2026.png",
  "./assets/affiche-moisson-2026-thumb.jpg",
  "./assets/programme-moisson-2026-thumb.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  // Les navigations passent TOUJOURS par le réseau. Servies depuis le cache,
  // elles court-circuitent les redirections définies côté serveur (/ vers
  // /moisson/, /don vers HelloAsso) : le navigateur ne les voit jamais et
  // affiche la page mise en cache à la place. Pour une navigation, la requête
  // a redirect="manual", donc fetch renvoie la redirection telle quelle et
  // c'est le navigateur qui la suit.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type === "opaque") return response;
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy));
        return response;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
