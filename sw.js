/* ═══════════════════════════════════════════════
   Carlos Tattoo BH — Service Worker v2
   Estratégia: Cache-First para assets estáticos
               Network-First para HTML/navegação
               Bypass para APIs externas
═══════════════════════════════════════════════ */

const CACHE_STATIC = 'ct-static-v2';
const CACHE_PAGES  = 'ct-pages-v2';
const CACHE_FONTS  = 'ct-fonts-v2';

/* Assets que sempre devem estar em cache */
const STATIC_ASSETS = [
  '/main.js',
  '/checkout.js',
  '/rabisco.js',
  '/imagens/IPJP8350.JPG',
  '/imagens/carlitos_fw.png',
  '/imagens/perfil.jpg',
  '/imagens/pix.png',
];

/* Páginas HTML em cache para offline */
const PAGE_ASSETS = [
  '/',
  '/index.html',
];

/* Origens que NUNCA devem ser interceptadas */
const BYPASS_ORIGINS = [
  'supabase.co',
  'ipapi.co',
  'connect.facebook.net',
  'googletagmanager.com',
  'paypal.com',
  'mercadopago.com',
  'api.anthropic.com',
];

/* ── INSTALL: pré-cacheia assets críticos ── */
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_STATIC).then(c => c.addAll(STATIC_ASSETS).catch(() => {})),
      caches.open(CACHE_PAGES).then(c => c.addAll(PAGE_ASSETS).catch(() => {})),
    ])
  );
  self.skipWaiting();
});

/* ── ACTIVATE: limpa caches antigos ── */
self.addEventListener('activate', event => {
  const VALID = new Set([CACHE_STATIC, CACHE_PAGES, CACHE_FONTS]);
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => !VALID.has(k)).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ── FETCH: roteamento por tipo de recurso ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  /* 1. Ignora requisições não-GET */
  if (request.method !== 'GET') return;

  /* 2. Bypass para origens externas (APIs, analytics, pagamentos) */
  if (BYPASS_ORIGINS.some(origin => url.hostname.includes(origin))) return;

  /* 3. Fontes Google — Cache-First com longa validade */
  if (url.hostname.includes('fonts.google') || url.hostname.includes('fonts.gstatic')) {
    event.respondWith(
      caches.open(CACHE_FONTS).then(async cache => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  /* 4. Navegação HTML — Network-First (garante conteúdo atualizado) */
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_PAGES).then(c => c.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then(c => c || caches.match('/index.html')))
    );
    return;
  }

  /* 5. JS / imagens locais — Cache-First com revalidação em background */
  event.respondWith(
    caches.match(request).then(async cached => {
      const networkFetch = fetch(request).then(response => {
        if (response.ok) {
          const cacheName = request.destination === 'script' ? CACHE_STATIC : CACHE_STATIC;
          caches.open(cacheName).then(c => c.put(request, response.clone()));
        }
        return response;
      }).catch(() => null);

      /* Retorna cache imediatamente; atualiza em background */
      return cached || networkFetch;
    })
  );
});
