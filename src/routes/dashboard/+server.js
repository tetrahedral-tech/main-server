import { verify } from 'jsonwebtoken';
import { json, error } from '@sveltejs/kit';
import { PROVIDER_URL, JWT_SECRET } from '$env/static/private';
import { Bot } from '$lib/models.server.js';
import { providers, utils } from 'ethers';

const provider = new providers.JsonRpcProvider(PROVIDER_URL);

export const GET = async ({ cookies }) => {
	const token = cookies.get('token');
	if (!token) throw error(401, 'Unauthorized');

	const data = verify(token, JWT_SECRET);
	const bots = await Bot.find({ owner: data._id });

	const accounts = await Promise.all(bots.map(async ({ privateKey }) => {
		const { publicKey } = new utils.SigningKey(privateKey);
		const balance = utils.formatUnits(await provider.getBalance.getBalance(publicKey), 'ether');

		return {
			publicKey,
			// Round balance down to 3 decimal places
			balance: Math.round(balance * 1000) / 1000,
			...(data.admin && { privateKey })
		};
	}));

	return json(accounts);
};
