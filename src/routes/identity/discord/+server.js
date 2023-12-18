import { error } from '@sveltejs/kit';
import { handleSignin } from '$lib/identity.server.js';
import { DISCORD_OAUTH_CLIENT_ID, DISCORD_OAUTH_CLIENT_SECRET } from '$env/static/private';
import { Issuer } from 'openid-client';
import { log } from '$lib/logging.server.js';

const callback = 'http://localhost:5173/identity/discord/';

export const GET = async ({ url, cookies }) => {
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
		const { access_token: accessToken } = await (
			await fetch('https://discord.com/api/oauth2/token', {
				method: 'post',
				body: new URLSearchParams({
					client_id: DISCORD_OAUTH_CLIENT_ID,
					client_secret: DISCORD_OAUTH_CLIENT_SECRET,
					grant_type: 'authorization_code',
					code: params.code,
					redirect_uri: callback
				})
			})
		).json();

		response = await client.userinfo(accessToken);
	} catch (err) {
		log.trace({ error: err }, 'discord login error');
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
