import { error } from '@sveltejs/kit';
import { handleSignin } from '$lib/identity.server.js';
import {
	GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET,
	CODE_VERIFIER_SECRET
} from '$env/static/private';
import { Issuer } from 'openid-client';
import { createDecipheriv } from 'crypto';

const callback = 'http://localhost:5173/identity/google/';

export const GET = async ({ url, cookies }) => {
	const issuer = await Issuer.discover('https://accounts.google.com');

	const client = new issuer.Client({
		client_id: GOOGLE_OAUTH_CLIENT_ID,
		client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
		redirect_uris: [callback],
		response_types: ['code']
	});

	let codeVerifier;
	try {
		const [iv, encrypted] = cookies
			.get('code_verifier')
			.split(':')
			.map(part => Buffer.from(part, 'hex'));
		const decipher = createDecipheriv('aes-256-cbc', Buffer.from(CODE_VERIFIER_SECRET, 'hex'), iv);
		codeVerifier = decipher.update(encrypted);
		codeVerifier = Buffer.concat([codeVerifier, decipher.final()]).toString();
	} catch (err) {
		throw error(400, 'Bad Request');
	}

	let response;
	try {
		const params = client.callbackParams(url.href);
		const { access_token: accessToken } = await client.callback(callback, params, {
			code_verifier: codeVerifier
		});
		response = await client.requestResource(
			'https://people.googleapis.com/v1/people/me?personFields=names,photos,genders,metadata',
			accessToken
		);
	} catch (err) {
		throw error(401, 'Error logging in with Google');
	}

	const { metadata, names, photos, genders } = JSON.parse(response.body.toString());

	await handleSignin(cookies, {
		provider: 'google',
		name: names[0].displayName,
		photo: photos[0].url,
		gender: ['male', 'female'].includes(genders[0].value) ? genders[0].value : null,
		id: metadata.sources[0].id
	});
};
