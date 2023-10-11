import { error, redirect } from '@sveltejs/kit';
import {
	GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET,
	DISCORD_OAUTH_CLIENT_ID,
	DISCORD_OAUTH_CLIENT_SECRET,
	CODE_VERIFIER_SECRET,
	JWT_SECRET
} from '$env/static/private';
import { verify } from 'jsonwebtoken';
import { Issuer, generators } from 'openid-client';
import { randomBytes, createCipheriv } from 'crypto';
import { handleSignin } from '$lib/identity.server.js';

const handleOAuth = ({ cookies, client, scope, resource, verifierType = 'state' }) => {
	let verifier;
	if (verifierType === 'code_challenge') {
		// Encrypt code verifier and store it
		const codeVerifier = generators.codeVerifier();
		const iv = randomBytes(16);
		const cipher = createCipheriv('aes-256-cbc', Buffer.from(CODE_VERIFIER_SECRET, 'hex'), iv);
		let encrypted = cipher.update(codeVerifier);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		// @TODO make cookies expire
		cookies.set('code_verifier', `${iv.toString('hex')}:${encrypted.toString('hex')}`, {
			path: '/'
		});

		verifier = generators.codeChallenge(codeVerifier);
	} else {
		verifier = randomBytes(8).toString('hex');
		// @TODO make cookies expire
		cookies.set('state', verifier, {
			path: '/'
		});
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

export const actions = {
	force: async ({ cookies, request }) => {
		const formData = await request.formData();

		const token = cookies.get('token');
		const id = formData.get('id');
		const data = verify(token, JWT_SECRET);

		if (!token || !data.admin) throw error(401, 'Unauthorized');
		if (!id) throw error(400, 'Bad Request');

		await handleSignin(cookies, {
			id,
			force: true
		});
	},
	google: async ({ cookies }) => {
		const issuer = await Issuer.discover('https://accounts.google.com');

		const client = new issuer.Client({
			client_id: GOOGLE_OAUTH_CLIENT_ID,
			client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
			redirect_uris: ['http://localhost:5173/identity/google/'],
			response_types: ['code']
		});

		handleOAuth({
			cookies,
			client,
			scope:
				// eslint-disable-next-line max-len
				'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.gender.read openid',
			resource: 'https://accounts.google.com/o/oauth2/v2/auth',
			verifierType: 'code_challenge'
		});
	},
	discord: async ({ cookies }) => {
		const issuer = new Issuer({
			authorization_endpoint: 'https://discord.com/api/oauth2/authorize',
			token_endpoint: 'https://discord.com/api/oauth2/token',
			userinfo_endpoint: 'https://discord.com/api/users/@me',
			token_endpoint_auth_methods_supported: ['client_secret_post']
		});

		const client = new issuer.Client({
			client_id: DISCORD_OAUTH_CLIENT_ID,
			client_secret: DISCORD_OAUTH_CLIENT_SECRET,
			redirect_uris: ['http://localhost:5173/identity/discord/'],
			response_types: ['code']
		});

		handleOAuth({
			cookies,
			client,
			scope: 'identify',
			resource: 'https://discord.com/api/oauth2/authorize'
		});
	}
};

export const load = async ({ cookies }) => {
	const token = cookies.get('token');
	if (!token) return; // instead of throwing a redirect (which puts it into a loop); itll show the screen instead !

	const data = verify(token, JWT_SECRET);
	return { admin: data.admin };
};
