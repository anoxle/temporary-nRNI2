const CACHE_NAME = 'anoxle-startpage-v2026.10.06.075619';
const FONT_CACHE = 'anoxle-fonts-v1';
const SHELL_ASSETS = ["./","./index.html","./assets/app.js","./assets/app.css","./icon.png","./assets/icon.png","./manifest.json","./assets/manifest.json","./default.json","./default-mobile.json"];
const REQUIRED = ['./index.html', './assets/app.js', './default.json'];
const BYPASS = ['version.txt', 'sw.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.all(SHELL_ASSETS.map(path =>
    fetch(new Request(path, { cache: 'reload' })).then(res => {
      if (!res.ok) throw new Error(path + ' ' + res.status);
      return cache.put(path, res);
    }).catch(err => {
      if (REQUIRED.includes(path)) throw err;
    })
  ))));
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME && k !== FONT_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function store(e, cacheName, req, res) {
  if (res.ok) {
    const clone = res.clone();
    e.waitUntil(caches.open(cacheName).then(c => c.put(req, clone)));
  }
}

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (url.origin === self.location.origin && BYPASS.some(n => url.pathname.endsWith('/' + n))) return;
  if (url.searchParams.has('reset')) return;

  const isFontFile = url.pathname.includes('/assets/fonts/') && !url.pathname.endsWith('.css');
  if (isFontFile || req.destination === 'font') {
    e.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
      store(e, FONT_CACHE, req, res);
      return res;
    })));
    return;
  }

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req, { cache: 'no-cache' }).then(res => {
      store(e, CACHE_NAME, req, res);
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
    return;
  }

  if (url.origin === self.location.origin) {
    e.respondWith(fetch(req, { cache: 'no-cache' }).then(res => {
      store(e, CACHE_NAME, req, res);
      return res;
    }).catch(() => caches.match(req)));
  }
});
