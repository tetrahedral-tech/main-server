import {
	ALGORITHM_SERVER_BASE_URL,
	DB_URI,
	JWT_SECRET
} from '$env/static/private';
import { Bot } from '$lib/models.server';

import { sign } from 'jsonwebtoken';
import { connect } from 'mongoose';
import { createClient } from 'redis';
import schedule from 'node-schedule';

import executeAllTransactions from './trading';

connect(DB_URI);
const redis = createClient();

// Algorithm Check Job
const job = schedule.scheduleJob('*/5 * * * *', async () => {
	console.log('Running algorithm check');

	try {
		const token = sign({ event: 'auth' }, JWT_SECRET, { algorithm: 'HS256' });
		await fetch(`${ALGORITHM_SERVER_BASE_URL}/internal_checker`, {
			headers: {
				Authorization: token
			}
		});
	} catch (err) { /* return; */ }

	await redis.connect();

	const signals = await redis.hGetAll('signals');
	const strengths = await redis.hGetAll('strengths');
	const bots = await Bot.find({}).populate('algorithm');

	const tradeData = bots.map(bot => {
		const field = bot.algorithm.owner ? bot.algorithm._id : bot.algorithm.name;
		const signal = signals[field];
		const strength = Number(strengths[field]);

		return { privateKey: bot.privateKey, amount: bot.strengthToUSD * strength, signal };
	});

	await executeAllTransactions(tradeData);
	await redis.disconnect();
});

job.invoke();

redis.on('error', err => console.log('Redis Client Error', err));
