import jwt from 'jsonwebtoken';
import { error } from '@sveltejs/kit';
import { Issuer } from 'openid-client';

import {
	GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET,
	DISCORD_OAUTH_CLIENT_ID,
	DISCORD_OAUTH_CLIENT_SECRET,
	JWT_SECRET
} from '$env/static/private';
import { handleSignin, handleOAuth } from './signin.js';

export const actions = {
	force: async ({ cookies, request }) => {
		const formData = await request.formData();

		const token = cookies.get('token');
		const id = formData.get('id');

		if (!token) throw error(401, 'Unauthorized');
		if (!id) throw error(400, 'Bad Request');

		const data = jwt.verify(token, JWT_SECRET);
		if (!data.admin) throw error(401, 'Unauthorized');

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

	const data = jwt.verify(token, JWT_SECRET);
	return { admin: data.admin };
};
