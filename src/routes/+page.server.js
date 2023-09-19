import { fail } from '@sveltejs/kit';
import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import WebSocket from 'ws';

export async function load({ cookies }) {
	const token = cookies.get('token');
	let account;
	if (!token) return { success: false, error: 'No token set' };

	try {
		return { success: true, account: verify(token, JWT_SECRET), token };
	} catch (err) {
		return { success: false, error: 'Invalid Token', detailed: err };
	}
};

export const actions = {
	default: async event => {
		if (ws.readyState !== ws.OPEN) return fail(500, { success: false, error: 'Algorithm server not connected' });

		const token = sign({ event: 'auth' }, JWT_SECRET, { expiresIn: '1d' });
		ws.send(token);

		return {
			success: true
		};
	}
};
