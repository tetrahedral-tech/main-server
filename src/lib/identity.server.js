import jwt from 'jsonwebtoken';
import { error, redirect } from '@sveltejs/kit';

import { JWT_SECRET } from '$env/static/private';
import { Identity, User } from '$lib/models.server.js';

export const handleSignin = async (cookies, data) => {
	let user = await User.findOne({ identity: data.id });

	if (!user)
		if (data.force) throw error(400, 'Bad Request');
		else {
			const identity = new Identity(data);

			await identity.save();

			user = new User({
				admin: false,
				identity: identity._id
			});

			await user.save();
		}

	user = await user.populate('identity');

	const expiryDate = 60 * 60 * 24 * 15; // 15 days

	const token = jwt.sign(user.toJSON(), JWT_SECRET, {
		algorithm: 'HS256',
		expiresIn: expiryDate
	});

	cookies.set('token', token, {
		path: '/',
		maxAge: expiryDate,
		httpOnly: true,
		secure: false // @TODO set this to true
	});

	throw redirect(303, '/dashboard');
};
