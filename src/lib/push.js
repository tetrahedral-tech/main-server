import { browser } from '$app/environment';

export const pushSupported =
	browser && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
