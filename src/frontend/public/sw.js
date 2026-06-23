self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || 'Tienes una nueva notificación de IngenioSnack.',
    icon: data.icon || '/icon-192.png',
    badge: '/icon-192.png',
    data: data.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'IngenioSnack', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Abrir la app o enfocar la ventana existente
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Si la URL de origen de notificaciones es relevante
      for (let client of windowClients) {
        if (client.url.includes('/perfil') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/perfil');
      }
    })
  );
});
