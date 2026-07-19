// Zovu Service Worker — Push Notifications

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});

self.addEventListener('push', function(e) {
  if (!e.data) return;
  const payload = e.data.json();

  const options = {
    body: payload.body || '',
    icon: '/zovu-icon-192.png',
    badge: '/favicon-32x32.png',
    data: { url: payload.url || '/' },
    tag: payload.tag || 'zovu',
    renotify: true,
    vibrate: [200, 100, 200],
  };

  e.waitUntil(
    self.registration.showNotification(payload.title || 'Zovu', options)
  );
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.includes(self.location.origin)) {
          return list[i].focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
