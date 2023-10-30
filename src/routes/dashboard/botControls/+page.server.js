import { JWT_SECRET } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { job as algorithmCheckJob } from '../../../hooks.server';

export const actions = {
	invokeAlgorithmCheck: async ({ cookies }) => {
		const token = cookies.get('token');
		if (!token) return fail(401, 'Unauthorized');

		const owner = jwt.verify(token, JWT_SECRET);
		if (!owner.admin) return fail(401, 'Unauthorized');

		algorithmCheckJob.invoke();
	}
};
