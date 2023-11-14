import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { inspect } from 'util';

import { ALGORITHM_SERVER_URI, JWT_SECRET } from '$env/static/private';
import { toReadableAmount, defaultBaseToken } from '$lib/blockchain';
import { Bot } from '$lib/models.server';

import executeApprovals from './approval';
import executeTransactions from './trading';
import addWorths from './worth';

export default async redis => {
	console.log('Running algorithm check');
	try {
		const token = jwt.sign({ event: 'auth' }, JWT_SECRET, { algorithm: 'HS256' });
		await fetch(`${ALGORITHM_SERVER_URI}/internal_checker`, {
			headers: {
				Authorization: token
			}
		});
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
			const strength = Math.round(Number(strengths[field]) * 10) / 10;

			return {
				id: bot._id,
				privateKey: bot.privateKey(),
				amount: (10 || bot.strengthToUSD) * strength,
				strengthToUSD: bot.strengthToUSD,
				signal
			};
		})
		.filter(b => b);

	const approvalResults = await executeApprovals(tradeData);
	const transactionResults = await executeTransactions(
		tradeData.filter(data => data.strength > 0 && data.signal !== 'no_action')
	);
	const worthsResults = await addWorths(tradeData);

	const inspectOptions = { depth: 10, colors: true };
	console.log('approvals', inspect(approvalResults, inspectOptions));
	console.log('transactions', inspect(transactionResults, inspectOptions));
	console.log('worths', inspect(worthsResults, inspectOptions));

	// Update worths
	Bot.bulkWrite(
		worthsResults
			.filter(r => r.status === 'fulfilled')
			.map(r => r.value)
			.map(({ id, worth }) => ({
				updateOne: {
					filter: { _id: new mongoose.Types.ObjectId(id) },
					update: {
						$push: {
							worth: {
								timestamp: Date.now(),
								value: toReadableAmount(worth, defaultBaseToken.decimals)
							}
						}
					}
				}
			}))
	);
};
