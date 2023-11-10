import webpush from 'web-push';
import { PUBLIC_PUSH_SERVER_KEY } from '$env/static/public';
import { PUSH_SERVER_KEY } from '$env/static/private';

export const setVapidDetails = () =>
	webpush.setVapidDetails(
		// @TODO change this
		'mailto: celestialcraftermc@gmail.com',
		PUBLIC_PUSH_SERVER_KEY,
		PUSH_SERVER_KEY
	);
