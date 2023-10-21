import { DB_URI, JWT_SECRET } from '$env/static/private';
import { REDIS_URI, ALGORITHM_SERVER_URI } from '$env/static/private';
import { Bot } from '$lib/models.server';
import { toReadableAmount } from '$lib/blockchain.server';

import { connect, Types as MongooseTypes } from 'mongoose';
import { createClient } from 'redis';
import schedule from 'node-schedule';
import jwt from 'jsonwebtoken';

import executeTransactions from './blockchain/trading';
import addWorths, { defaultBaseToken } from './blockchain/worth';

const connection = connect(DB_URI);
const redis = createClient({ url: REDIS_URI });

// Algorithm Check Job
const job = schedule.scheduleJob('*/5 * * * *', async () => {
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
			if (bot.state.type === 'paused') return;
			if (bot.state.type === 'tempPaused')
				if (bot.state.time > Date.now()) {
					/* eslint-disable no-param-reassign */
					bot.state.type = 'running';
					bot.state.time = null;
					/* eslint-disable no-param-reassign */
					Bot.save();
				} else return;

			const field = bot.algorithm.owner ? bot.algorithm._id : bot.algorithm.name;
			const signal = signals[field];
			const strength = Number(strengths[field]);

			return {
				id: bot._id,
				privateKey: bot.privateKey,
				amount: bot.strengthToUSD * strength,
				signal
			};
		})
		.filter(b => b);

	await executeTransactions(tradeData);

	// Update worths
	const worths = await addWorths(tradeData);
	Bot.bulkWrite(
		worths
			.filter(r => r.status === 'fulfilled')
			.map(r => r.value)
			.map(({ value, id }) => ({
				updateOne: {
					filter: { _id: new MongooseTypes.ObjectId(id) },
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

	await redis.disconnect();
});

const shutdown = async signal => {
	job.cancel();
	await (await connection).disconnect();
	redis.isOpen && (await redis.disconnect());
	throw Error(`Shutting down${signal ? `due to ${signal}` : ''}...`);
};

redis.on('error', err => console.log('Redis Client Error', err));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
