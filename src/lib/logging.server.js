import bunyan from 'bunyan';
const { WARN, createLogger, stdSerializers } = bunyan;

const transactionSerializer = transaction => {
	if (!transaction?.status) return transaction;

	return {
		successful: transaction.status,
		transactionHash: transaction.transactionHash,
		from: transaction.from,
		to: transaction.to,
		gas: transaction.gasUsed
	};
};

const svelteRequestEventSerializer = event => {
	if (!event?.request) return event;
	const eventCopy = { ...event };

	const headers = Object.fromEntries(event.request.headers);
	delete headers.cookie;
	delete eventCopy.request.platform;

	let address = 'unknown';

	try {
		address = eventCopy.getClientAddress();
	} catch (err) {}

	return {
		method: eventCopy.request.method,
		url: eventCopy.url,
		headers,
		remoteAddress: address,
		platform: eventCopy.platform,
		id: crypto.randomUUID()
	};
};

export const log = createLogger({
	name: 'main-server',
	streams: [
		{
			path: 'server.log'
		},
		{
			stream: process.stdout
		},
		{
			stream: process.stderr,
			level: WARN
		}
	],
	serializers: {
		transaction: transactionSerializer,
		request: svelteRequestEventSerializer,
		error: stdSerializers.err
	}
});
