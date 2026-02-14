self.addEventListener('push', (event) => {
    const data = event.data.json();
    const title = data.title || '이소에 모바일';
    const options = {
        body: data.body || '새로운 알림이 도착했습니다.',
        icon: '/iso_main.png',
        badge: '/iso_main.png',
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
