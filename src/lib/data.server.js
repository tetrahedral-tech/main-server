import { Algorithm } from '$lib/models.server.js';

export const getAllowedAlgorithms = async id =>
	Algorithm.find({
		$or: [{ owner: id }, { owner: { $exists: false } }]
	});
