import { verify } from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';
import { Bot } from '$lib/models.server.js';
import { Wallet } from 'ethers';

const formatter = Intl.NumberFormat('en-US', {
	notation: 'compact',
	maximumFractionDigits: 1
});

export const load = async ({ cookies }) => {
	const token = cookies.get('token');
	if (!token) throw redirect(303, '/identity');

	const user = verify(token, JWT_SECRET);
	const bots = await Bot.find({ owner: user._id });

	const accounts = await Promise.all(
		bots.map(async ({ worth, privateKey, _id: id }) => {
			const address = await new Wallet(privateKey).getAddress();

			return {
				id: id.toString(),
				address,
				balance: formatter.format(worth[worth.length - 1]?.value || 0),
				status: 'running',
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
