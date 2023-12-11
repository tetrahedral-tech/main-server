import mongoose from 'mongoose';
import schedule from 'node-schedule';
import { createClient } from 'redis';

import { DB_URI, REDIS_URI } from '$env/static/private';
import { evaluateModelsWhenConnectionReady } from '$lib/models.server';

import executeAlgorithmCheck from './trading/check';
import { log } from '$lib/logging.server';

mongoose.connect(DB_URI);
const redis = createClient({ url: REDIS_URI });
await evaluateModelsWhenConnectionReady();

export const job = schedule.scheduleJob(`*/5 * * * *`, () =>
	executeAlgorithmCheck(redis)
		.catch()
		.finally(() => redis.isOpen && redis.disconnect())
);

export const handle = async ({ event, resolve }) => {
	const startTimestamp = Date.now();

	const response = await resolve(event);
	const responseTime = Date.now() - startTimestamp;

	// @TODO include request id, and log body
	log.info({ request: event, responseTime }, 'request');
	response.headers.set('X-Response-Time', responseTime);

	return response;
};

export const handleError = async ({ error, event }) => {
	log.error({ error, request: event }, 'request error');
};

const shutdown = async signal => {
	job.cancel();
	await (await mongoose.connection).disconnect();
	redis.isOpen && (await redis.disconnect());
	throw Error(`Shutting down${signal ? `due to ${signal}` : ''}...`);
};

redis.on('error', err => log.error({ error: err }, 'redis error'));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
