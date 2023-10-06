import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export async function load({ cookies }) {
	const token = cookies.get('token');
	if (!token) return { success: false, error: 'No token set' };

	try {
		return { success: true, account: verify(token, JWT_SECRET) };
	} catch (err) {
		return { success: false, error: 'Invalid Token', detailed: err };
	}
}
