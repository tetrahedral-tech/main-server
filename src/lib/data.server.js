import { Algorithm } from '$lib/models.server.js';

export const getAllowedAlgorithms = async id => {
	console.log(await Algorithm.find({}));
	return Algorithm.find({
		$or: [{ owner: id }, { owner: { $exists: false } }]
	});
};
