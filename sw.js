// Service worker: l'app funziona anche senza rete. Ogni versione ha la sua cache; la nuova sostituisce la vecchia.
const V = 'rilievo-20261113-141935';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable.png', 'lib/pdf.min.js', 'lib/pdf.worker.min.js', 'lib/jszip.min.js', 'lib/dxf-parser.js', 'lib/firebase.js'];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('rilievo-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin) return; // l'AI (api.anthropic.com) non passa di qui
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r).catch(() => r.mode === 'navigate' ? caches.match('index.html') : Response.error())));
});
