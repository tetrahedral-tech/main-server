/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

self.oninstall = () => self.skipWaiting();
self.onpush = event => {
	const title = event.data.text();
	event.waitUntil(self.registration.showNotification(title));
};
