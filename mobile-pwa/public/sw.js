self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'https://cdn-icons-png.flaticon.com/512/1008/1008928.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/1008/1008928.png',
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      requireInteraction: true,
      data: data.url
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});
