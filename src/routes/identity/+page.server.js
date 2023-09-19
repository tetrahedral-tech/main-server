import { redirect } from '@sveltejs/kit';
import {
	GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET,
	DISCORD_OAUTH_CLIENT_ID,
	DISCORD_OAUTH_CLIENT_SECRET,
	CODE_VERIFIER_SECRET
} from '$env/static/private';
import { googleRedirectURI } from '$lib/identity.server.js';
import { Issuer, generators } from 'openid-client';
import { randomBytes, createCipheriv } from 'crypto';

const handleOAuth = ({ cookies, client, scope, resource, verifier_type = 'state' }) => {
	let verifier;
	if (verifier_type === 'code_verifier') {
		// Encrypt code verifier and store it
		const code_verifier = generators.codeVerifier();
		const iv = randomBytes(16);
		const cipher = createCipheriv('aes-256-cbc', Buffer.from(CODE_VERIFIER_SECRET, 'hex'), iv);
		let encrypted = cipher.update(code_verifier);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		// @TODO make cookies expire
		cookies.set('code_verifier', `${iv.toString('hex')}:${encrypted.toString('hex')}`, {
			path: '/'
		});

		verifier = generators.codeChallenge(code_verifier);
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
		...(verifier_type === 'code_verifier' ? { code_verifier: verifier } : { state: verifier }),
	});

	throw redirect(302, authorizationUrl);
};

export const actions = {
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
			scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.gender.read openid',
			resource: 'https://accounts.google.com/o/oauth2/v2/auth',
			verifier_type: 'code_challenge'
		});
	},
	discord: async ({ cookies }) => {
		const issuer = new Issuer({
			authorization_endpoint: 'https://discord.com/api/oauth2/authorize',
			token_endpoint: 'https://discord.com/api/oauth2/token',
			userinfo_endpoint: 'https://discord.com/api/users/@me',
			token_endpoint_auth_methods_supported: [
				'client_secret_post'
			]
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