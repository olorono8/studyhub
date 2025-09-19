const CACHE_NAME = "mcp11th-cache-v2";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  // Pre-cache PDFs
  "./pdfs/Physics/Laws_of_Motion.pdf",
  "./pdfs/Physics/Work_and_Energy.pdf",
  "./pdfs/Physics/Gravitation.pdf",
  "./pdfs/Chemistry/Atomic_Structure.pdf",
  "./pdfs/Chemistry/Periodic_Table.pdf",
  "./pdfs/Chemistry/Chemical_Bonding.pdf"
  // 👉 add all your chapter PDFs here
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
