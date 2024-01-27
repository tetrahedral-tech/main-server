import jwt from 'jsonwebtoken';
import webpush from 'web-push';
import { error, redirect } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';
import { User } from '$lib/models.server';
import { setVapidDetails } from '$lib/push.server';

setVapidDetails();

export const load = async ({ cookies }) => {
	const token = cookies.get('token');
	if (!token) throw redirect(303, '/identity');

	const data = jwt.verify(token, JWT_SECRET);
	const user = await User.findOne({ _id: data._id });

	return { registered: Boolean(user?.pushSubscription) };
};

export const actions = {
	register: async ({ cookies, request }) => {
		const formData = await request.formData();

		const endpoint = formData.get('endpoint');
		const auth = formData.get('auth');
		const p256dh = formData.get('p256dh');

		const token = cookies.get('token');
		if (!token) throw redirect(303, '/identity');

		const data = jwt.verify(token, JWT_SECRET);
		await User.updateOne(
			{ _id: data._id },
			{
				pushSubscription: {
					endpoint,
					auth,
					p256dh
				}
			}
		);
	},
	test: async ({ cookies }) => {
		const token = cookies.get('token');
		if (!token) throw redirect(303, '/identity');

		const data = jwt.verify(token, JWT_SECRET);
		const user = await User.findOne({ _id: data._id });

		if (!user?.pushSubscription) throw error(400, 'Unregistered');
		const { pushSubscription } = user;

		await webpush
			.sendNotification(
				{
					endpoint: pushSubscription.endpoint,
					keys: {
						auth: pushSubscription.auth,
						p256dh: pushSubscription.p256dh
					}
				},
				JSON.stringify({ title: 'Test Notification' })
			)
			.catch();
	}
};
