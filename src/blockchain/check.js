import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { ALGORITHM_SERVER_URI, JWT_SECRET } from '$env/static/private';
import { toReadableAmount, defaultBaseToken } from '$lib/blockchain';
import { Bot } from '$lib/models.server';
import { log } from '$lib/logging.server';

import executeApprovals from './approval';
import executeTransactions from './trading';
import addWorths from './worth';

export default async redis => {
	log.info('algorithm check');

	try {
		const token = jwt.sign({ server: true }, JWT_SECRET, { algorithm: 'HS256' });
		const response = await (
			await fetch(`${ALGORITHM_SERVER_URI}/internal_checker`, {
				headers: {
					Authorization: token
				}
			})
		).json();

		if (!response.new_datapoint) return log.debug('no new datapoints');
	} catch (err) {
		return log.error({ error: err }, 'algorithm check error');
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
				signal,
				strength
			};
		})
		.filter(b => b);

	const tradeDataWithSignal = tradeData.filter(
		data => data.strength > 0 && data.signal !== 'no_action'
	);

	await executeApprovals(tradeDataWithSignal);
	await executeTransactions(tradeDataWithSignal);
	const worthsResults = await addWorths(tradeData);

	worthsResults.forEach(p =>
		p.status === 'fulfilled'
			? log.debug({ value: p.value.worth, id: p.value.id }, 'worth')
			: log.warn({ error: p.reason }, 'worth error')
	);

	// Update worths
	Bot.bulkWrite(
		worthsResults
			.filter(p => p.status === 'fulfilled')
			.map(({ value: { id, worth } }) => ({
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
