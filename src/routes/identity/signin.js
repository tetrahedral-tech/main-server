import jwt from 'jsonwebtoken';

import { error, redirect } from '@sveltejs/kit';
import { generators } from 'openid-client';
import { randomBytes, createCipheriv } from 'crypto';

import { CODE_VERIFIER_SECRET, JWT_SECRET } from '$env/static/private';
import { Identity, User } from '$lib/models.server.js';

const cookieOptions = {
	path: '/identity/',
	maxAge: 2.5 * 60,
	httpOnly: true,
	session: true,
	secure: false // @TODO change this to true later
};

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

export const handleOAuth = ({ cookies, client, scope, resource, verifierType = 'state' }) => {
	let verifier;
	if (verifierType === 'code_challenge') {
		// Encrypt code verifier and store it
		const codeVerifier = generators.codeVerifier();
		const iv = randomBytes(16);
		const cipher = createCipheriv('aes-256-cbc', Buffer.from(CODE_VERIFIER_SECRET, 'hex'), iv);
		let encrypted = cipher.update(codeVerifier);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		cookies.set(
			'code_verifier',
			`${iv.toString('hex')}:${encrypted.toString('hex')}`,
			cookieOptions
		);

		verifier = generators.codeChallenge(codeVerifier);
	} else {
		verifier = randomBytes(8).toString('hex');
		cookies.set('state', verifier, cookieOptions);
	}

	const authorizationUrl = client.authorizationUrl({
		scope,
		resource,
		...(verifierType === 'code_challenge'
			? { code_challenge: verifier, code_challenge_method: 'S256' }
			: { state: verifier })
	});

	throw redirect(302, authorizationUrl);
};
