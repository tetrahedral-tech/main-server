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

	const headers = Object.fromEntries(event.request.headers);
	delete headers.cookie;

	return {
		method: event.request.method,
		url: event.url,
		headers,
		remoteAddress: event.getClientAddress(),
		platform: event.platform,
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
