import { error, redirect } from '@sveltejs/kit';
import { handleSignin } from '$lib/identity.server.js';
import { DISCORD_OAUTH_CLIENT_ID, DISCORD_OAUTH_CLIENT_SECRET, JWT_SECRET, CODE_VERIFIER_SECRET } from '$env/static/private';
import { Issuer, generators } from 'openid-client';
import { createDecipheriv } from 'crypto';

const callback = 'http://localhost:5173/identity/discord/';

export const GET = async ({ url, cookies }) => {
	const code = await url.searchParams.get('code');
	const issuer = new Issuer({
		authorization_endpoint: 'https://discord.com/api/oauth2/authorize',
		token_endpoint: 'https://discord.com/api/oauth2/token',
		userinfo_endpoint: 'https://discord.com/api/users/@me'
	});

	const client = new issuer.Client({
		client_id: DISCORD_OAUTH_CLIENT_ID,
		client_secret: DISCORD_OAUTH_CLIENT_SECRET,
		redirect_uris: [callback],
		response_types: ['code']
	});

	const state = cookies.get('state');
	const params = client.callbackParams(url.href);
	if (!state || state !== params.state) throw error(400, 'Bad Request');

	let response;
	try {
		const { access_token: accessToken } = await (await fetch('https://discord.com/api/oauth2/token', {
			method: 'post',
			body: new URLSearchParams({
				client_id: DISCORD_OAUTH_CLIENT_ID,
				client_secret: DISCORD_OAUTH_CLIENT_SECRET,
				grant_type: 'authorization_code',
				code: params.code,
				redirect_uri: callback
			})
		})).json();

		response = await client.userinfo(accessToken);
	} catch (err) {
		throw error(401, 'Error logging in with Discord');
	}

	const { username, id, avatar: avatarHash } = response;

	await handleSignin(cookies, {
		provider: 'discord',
		name: username,
		photo: `https://cdn.discordapp.com/avatars/${id}/${avatarHash}.png`,
		id
	});
};
