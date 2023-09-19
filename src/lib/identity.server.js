import { redirect } from '@sveltejs/kit';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { Identity, User } from '$lib/models.server.js';

export const handleSignin = async (cookies, data) => {
	let user = await User.findOne({ identity: data.id });

	if (!user) {
		const identity = new Identity(data);

		await identity.save();

		user = new User({
			admin: false,
			identity: identity._id
		});

		await user.save();
	}

	user = await user.populate('identity');
	const token = sign(user.toJSON(), JWT_SECRET, { algorithm: 'HS256' });
	cookies.set('token', token, {
		path: '/'
	});

	throw redirect(303, '/dashboard');
};
