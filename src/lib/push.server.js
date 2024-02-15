import webpush from 'web-push';
import { User } from '$lib/models.server';
import { PUBLIC_PUSH_SERVER_KEY } from '$env/static/public';
import { PUSH_SERVER_KEY } from '$env/static/private';

export const setVapidDetails = () =>
	webpush.setVapidDetails(
		// @TODO change email to an auto-trading domain one
		'mailto: celestialcraftermc@gmail.com',
		PUBLIC_PUSH_SERVER_KEY,
		PUSH_SERVER_KEY
	);

export const sendNotification = async (data, user) => {
	setVapidDetails();
	// eslint-disable-next-line no-param-reassign
	if (typeof user === 'string') user = await User.findById(user);
	if (!user?.pushSubscription) return;

	const { pushSubscription } = user;
	return webpush.sendNotification(
		{
			endpoint: pushSubscription.endpoint,
			keys: {
				auth: pushSubscription.auth,
				p256dh: pushSubscription.p256dh
			}
		},
		JSON.stringify(data)
	);
};
