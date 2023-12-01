import mongoose from 'mongoose';
import schedule from 'node-schedule';
import { createClient } from 'redis';

import { DB_URI, REDIS_URI } from '$env/static/private';
import { evaluateModelsWhenConnectionReady } from '$lib/models.server';

import executeAlgorithmCheck from './blockchain/check';

mongoose.connect(DB_URI);
const redis = createClient({ url: REDIS_URI });
await evaluateModelsWhenConnectionReady();

export const job = schedule.scheduleJob(`*/5 * * * *`, () =>
	executeAlgorithmCheck(redis)
		.catch()
		.finally(() => redis.isOpen && redis.disconnect())
);

const shutdown = async signal => {
	job.cancel();
	await (await mongoose.connection).disconnect();
	redis.isOpen && (await redis.disconnect());
	throw Error(`Shutting down${signal ? `due to ${signal}` : ''}...`);
};

redis.on('error', err => console.log('Redis Client Error', err));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
