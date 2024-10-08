import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';
import { Bot } from '$lib/models.server.js';

const formatter = Intl.NumberFormat('en-US', {
	notation: 'compact',
	maximumFractionDigits: 1
});

export const load = async ({ cookies }) => {
	const token = cookies.get('token');
	if (!token) throw redirect(303, '/identity');

	const user = jwt.verify(token, JWT_SECRET);
	const bots = await Bot.find({ owner: user._id });

	const accounts = await Promise.all(
		bots.map(async bot => {
			const { worth, _id: id, status, address } = bot;
			const privateKey = bot.privateKey();

			return {
				id: id.toString(),
				address,
				balance: formatter.format(Number(worth[worth.length - 1]?.value) || 0),
				status: status.toObject({ flattenObjectIds: true }),
				...(user.admin && { privateKey })
			};
		})
	);

	return {
		accounts,
		user: {
			...user,
			token
		}
	};
};
