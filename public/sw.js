const CACHE = 'flow-shell-v3';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/flow.ico', '/logo.png', '/flow-logo.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;
  // FASE 10: API nunca passa pelo cache (dados sempre frescos; sem HTML no lugar de JSON).
  const pathname = new URL(event.request.url).pathname;
  if (pathname.startsWith('/api')) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request).then(response => response || caches.match('/index.html'))));
});

// Web Push real: exibe notificação do backend; clique abre o app.
self.addEventListener('push', event => {
  let title = 'FLOW';
  let body = 'Você tem uma nova atualização.';
  try {
    const data = event.data ? event.data.json() : {};
    if (data.title) title = String(data.title);
    if (data.body) body = String(data.body);
  } catch { /* payload inválido: usa padrão */ }
  event.waitUntil(
    self.registration.showNotification(title, { body, icon: '/icons/flow-192.png', badge: '/icons/flow-192.png' }),
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/app');
      return undefined;
    }),
  );
});
