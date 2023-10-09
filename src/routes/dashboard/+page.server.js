import { verify } from 'jsonwebtoken';
import { error } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';
import { Bot } from '$lib/models.server.js';
import { Wallet } from 'ethers';

export const load = async ({ cookies }) => {
	const token = cookies.get('token');
	if (!token) throw error(401, 'Unauthorized');

	const data = verify(token, JWT_SECRET);
	const bots = await Bot.find({ owner: data._id });

	const accounts = await Promise.all(
		bots.map(async ({ worth, privateKey, _id: id }) => {
			const address = await new Wallet(privateKey).getAddress();

			return {
				id: id.toString(),
				address,
				// Round balance down to 3 decimal places
				balance: worth[worth.length - 1]?.value || 0,
				...(data.admin && { privateKey })
			};
		})
	);

	return { accounts, data, token };
};
