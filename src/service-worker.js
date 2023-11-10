/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

self.oninstall = () => self.skipWaiting();
self.onpush = event => {
	const data = event.data.json();
	console.log(data);
	event.waitUntil(
		self.registration.showNotification(data.title, {
			body: data.body,
			data: data.link
		})
	);
};

self.onnotificationclick = event => {
	const { notification } = event;
	notification.close();

	if (!event.notification.data) return;
	// eslint-disable-next-line no-undef
	event.waitUntil(clients.openWindow(event.notification.data));
};
