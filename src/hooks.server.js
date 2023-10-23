import { connect, connection, Types as MongooseTypes } from 'mongoose';
import { createClient } from 'redis';
import jwt from 'jsonwebtoken';
import schedule from 'node-schedule';

import { ALGORITHM_SERVER_URI, DB_URI, JWT_SECRET, REDIS_URI } from '$env/static/private';
import { toReadableAmount } from '$lib/blockchain.server';
import { evaluateModelsWhenConnectionReady } from '$lib/models.server';

import executeTransactions from './blockchain/trading';
import addWorths, { defaultBaseToken } from './blockchain/worth';

connect(DB_URI);
const redis = createClient({ url: REDIS_URI });
await evaluateModelsWhenConnectionReady();

import { Bot } from '$lib/models.server';

// Algorithm Check Job
const job = schedule.scheduleJob('*/50 * * * *', async () => {
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
			console.log(bot);
			if (bot.status.type === 'paused') return;
			if (bot.status.type === 'tempPaused')
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

// job.invoke();

const shutdown = async signal => {
	job.cancel();
	await (await connection).disconnect();
	redis.isOpen && (await redis.disconnect());
	throw Error(`Shutting down${signal ? `due to ${signal}` : ''}...`);
};

redis.on('error', err => console.log('Redis Client Error', err));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
