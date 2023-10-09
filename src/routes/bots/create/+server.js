import { Bot } from '$lib/models.server.js';
import { JWT_SECRET, WALLET_EXTRA_ENTROPY_SECRET } from '$env/static/private';
import { getAllowedAlgorithms } from '$lib/data.server.js';

import { json, error } from '@sveltejs/kit';
import { verify } from 'jsonwebtoken';
import { Wallet } from 'ethers';

export const POST = async ({ cookies, request }) => {
	const formData = await request.formData();

	const token = cookies.get('token');
	const chosenAlgorithm = formData.get('algorithm');
	const strengthToUSD = formData.get('strengthToUSD');

	if (!token) throw error(401, 'Unauthorized');
	const owner = verify(token, JWT_SECRET);

	const userAlgorithms = await getAllowedAlgorithms(owner._id);
	const usingAlgorithm = userAlgorithms.map(a => a.name).includes(chosenAlgorithm)
		? userAlgorithms.find(a => a.name === chosenAlgorithm)
		: userAlgorithms.find(a => a.name === 'rsi');

	const newBot = new Bot({
		owner: owner._id,
		algorithm: usingAlgorithm._id,
		strengthToUSD: Number(strengthToUSD) || 20,
		// @TODO handle encryption
		encryptedPrivateKey: Wallet.createRandom({
			extraEntropy: WALLET_EXTRA_ENTROPY_SECRET
		}).privateKey,
		worth: []
	});

	await newBot.save();

	return json({ newBot });
};
