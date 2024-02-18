import mongoose from 'mongoose';

import { DB_URI } from '$env/static/private';
import { evaluateModelsWhenConnectionReady } from '$lib/models.server';

import { log } from '$lib/logging.server';

mongoose.connect(DB_URI);
await evaluateModelsWhenConnectionReady();

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
	await (await mongoose.connection).disconnect();
	throw Error(`Shutting down${signal ? `due to ${signal}` : ''}...`);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
