import jwt from 'jsonwebtoken';
import { fail } from '@sveltejs/kit';
import { Wallet } from 'ethers';
import { Bot } from '$lib/models.server.js';
import { JWT_SECRET, WALLET_SECRET } from '$env/static/private';
import { getAllowedAlgorithms } from '$lib/data.server.js';

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
		const owner = jwt.verify(token, JWT_SECRET);

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
		const clearWorth = formData.get('clearWorth');
		const status = formData.get('status');
		const time = formData.get('time');

		const validStatuses = ['running', 'paused', 'tempPaused'];

		if (!token) return fail(401, 'Unauthorized');
		const owner = jwt.verify(token, JWT_SECRET);

		if (!(chosenAlgorithm || strengthToUSD || status || clearWorth) || !id)
			return fail(400, 'Bad Request');
		if (status === 'tempPause' && !Number(time)) return fail(400, 'Bad Request');
		if (status && !validStatuses.includes(status)) return fail(400, 'Bad Request');
		if (!(await Bot.exists({ _id: id, owner: owner._id }))) return fail(401, 'Unauthorized');

		const allowedAlgorithms = await getAllowedAlgorithms(owner._id);
		const algorithm = computeChosenAlgorithm(allowedAlgorithms, chosenAlgorithm);

		return (
			await Bot.findOneAndUpdate(
				{ _id: id },
				{
					...(strengthToUSD && { strengthToUSD: Number(strengthToUSD) || 20 }),
					...(chosenAlgorithm && { algorithm: algorithm._id }),
					...(status && {
						status: {
							name: status,
							time: time || 0
						}
					}),
					...(clearWorth && {
						worth: []
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
		const privateKeyOverride = formData.get('privateKey');

		if (!token) return fail(401, 'Unauthorized');
		const owner = jwt.verify(token, JWT_SECRET);

		if (privateKeyOverride && !owner.admin) return fail(401, 'Unauthorized');

		const allowedAlgorithms = await getAllowedAlgorithms(owner._id);
		const algorithm = computeChosenAlgorithm(allowedAlgorithms, chosenAlgorithm);

		const newBot = new Bot({
			owner: owner._id,
			algorithm: algorithm._id,
			strengthToUSD: Number(strengthToUSD) || 20,
			encryptedPrivateKey:
				privateKeyOverride ||
				Wallet.createRandom({
					extraEntropy: WALLET_SECRET
				}).privateKey,
			worth: [],
			status: {}
		});

		return (await newBot.save()).toObject({ flattenObjectIds: true });
	}
};
