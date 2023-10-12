import { Bot } from '$lib/models.server.js';
import { JWT_SECRET, WALLET_EXTRA_ENTROPY_SECRET } from '$env/static/private';
import { getAllowedAlgorithms } from '$lib/data.server.js';

import { fail } from '@sveltejs/kit';
import { verify } from 'jsonwebtoken';
import { Wallet } from 'ethers';

const computeChosenAlgorithm = (allowed, chosen) =>
	allowed.map(a => a.name).includes(chosen)
		? allowed.find(a => a.name === chosen)
		: allowed.find(a => a.name === 'rsi');

export const actions = {
	delete: async ({ cookies, request }) => {
		const formData = await request.formData();

		const token = cookies.get('token');
		const id = formData.get('id');

		if (!token) return fail(401, 'Unauthorized');
		const owner = verify(token, JWT_SECRET);

		if (!id) return fail(400, 'Bad Request');

		const { deletedCount } = await Bot.deleteOne({ _id: id, owner: owner._id });
		if (deletedCount < 1) return fail(400, 'Unauthorized');
	},
	update: async ({ cookies, request }) => {
		const formData = await request.formData();

		const token = cookies.get('token');
		const id = formData.get('id');
		const chosenAlgorithm = formData.get('algorithm');
		const strengthToUSD = formData.get('strengthToUSD');
		const state = formData.get('state');
		const time = formData.get('time');

		const validStates = ['running', 'paused', 'tempPaused'];

		if (!token) return fail(401, 'Unauthorized');
		const owner = verify(token, JWT_SECRET);

		if (!(chosenAlgorithm || strengthToUSD || state) || !id) return fail(400, 'Bad Request');
		if (state === 'tempPause' && !Number(time)) return fail(400, 'Bad Request');
		if (state && !validStates.includes(state)) return fail(400, 'Bad Request');
		if (!(await Bot.exists({ _id: id, owner: owner._id }))) return fail(401, 'Unauthorized');

		const allowedAlgorithms = await getAllowedAlgorithms(owner._id);
		const algorithm = computeChosenAlgorithm(allowedAlgorithms, chosenAlgorithm);

		return (
			await Bot.findOneAndUpdate(
				{ _id: id },
				{
					...(strengthToUSD && { strengthToUSD: Number(strengthToUSD) || 20 }),
					...(chosenAlgorithm && { algorithm: algorithm._id }),
					...(state && {
						state: {
							type: state,
							time
						}
					})
				},
				{
					returnDocument: 'after'
				}
			)
		).toObject({ flattenObjectIds: true });
	},
	create: async ({ cookies, request }) => {
		const formData = await request.formData();

		const token = cookies.get('token');
		const chosenAlgorithm = formData.get('algorithm');
		const strengthToUSD = formData.get('strengthToUSD');

		if (!token) return fail(401, 'Unauthorized');
		const owner = verify(token, JWT_SECRET);

		const allowedAlgorithms = await getAllowedAlgorithms(owner._id);
		const algorithm = computeChosenAlgorithm(allowedAlgorithms, chosenAlgorithm);

		const newBot = new Bot({
			owner: owner._id,
			algorithm: algorithm._id,
			strengthToUSD: Number(strengthToUSD) || 20,
			// @TODO handle encryption
			encryptedPrivateKey: Wallet.createRandom({
				extraEntropy: WALLET_EXTRA_ENTROPY_SECRET
			}).privateKey,
			worth: [],
			state: {
				type: 'running'
			}
		});

		return (await newBot.save()).toObject({ flattenObjectIds: true });
	}
};
