import { verify } from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';
import { Bot } from '$lib/models.server.js';
import { Wallet } from 'ethers';

const bigIntWorkaround = (number, decimals = 1) => {
	const usingDigits = BigInt(number)
		.toString()
		.slice(0, decimals + 1);

	return Number(usingDigits) / 10 ** decimals;
};

export const load = async ({ cookies }) => {
	const token = cookies.get('token');
	if (!token) throw redirect(303, '/identity');

	const data = verify(token, JWT_SECRET);
	const bots = await Bot.find({ owner: data._id });

	const accounts = await Promise.all(
		bots.map(async ({ worth, privateKey, _id: id }) => {
			const address = await new Wallet(privateKey).getAddress();

			return {
				id: id.toString(),
				address,
				balance: bigIntWorkaround(worth[worth.length - 1]?.value || 0, 3),
				status: 'running',
				...(data.admin && { privateKey })
			};
		})
	);

	return { accounts, data, token };
};
