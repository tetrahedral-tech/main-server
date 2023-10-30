import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { ALGORITHM_SERVER_URI, JWT_SECRET } from '$env/static/private';
import { toReadableAmount } from '$lib/blockchain.server';
import { Bot } from '$lib/models.server';

import executeTransactions from './trading';
import addWorths, { defaultBaseToken } from './worth';

export default async redis => {
	try {
		const token = jwt.sign({ event: 'auth' }, JWT_SECRET, { algorithm: 'HS256' });
		console.log(
			await fetch(`${ALGORITHM_SERVER_URI}/internal_checker`, {
				headers: {
					Authorization: token
				}
			})
		);
	} catch (err) {
		return console.log('Couldnt connect to algorithm server');
	}

	await redis.connect();

	const signals = await redis.hGetAll('signals');
	const strengths = await redis.hGetAll('strengths');
	const bots = await Bot.find({}).populate('algorithm');

	const tradeData = bots
		.map(bot => {
			if (bot.status.name === 'paused') return;
			if (bot.status.name === 'tempPaused')
				if (bot.status.time > Date.now())
					Bot.updateOne(
						{ _id: bot._id },
						{
							status: {
								type: 'running',
								time: 0
							}
						}
					);
				else return;

			const field = bot.algorithm.owner ? bot.algorithm._id : bot.algorithm.name;
			const signal = signals[field];
			const strength = Number(strengths[field]);

			return {
				id: bot._id,
				privateKey: bot.privateKey(),
				amount: (50000 || bot.strengthToUSD) * strength,
				signal
			};
		})
		.filter(b => b);

	const transactionResults = await executeTransactions(tradeData);
	console.log(transactionResults);

	// Update worths
	const worths = await addWorths(tradeData);
	Bot.bulkWrite(
		worths
			.filter(r => r.status === 'fulfilled')
			.map(r => r.value)
			.map(({ value, id }) => ({
				updateOne: {
					filter: { _id: new mongoose.Types.ObjectId(id) },
					update: {
						$push: {
							worth: {
								timestamp: Date.now(),
								value: toReadableAmount(value, defaultBaseToken.decimals)
							}
						}
					}
				}
			}))
	);
};
