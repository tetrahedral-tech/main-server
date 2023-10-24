import mongoose from 'mongoose';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { WALLET_SECRET } from '$env/static/private';

const { Schema, connection, models, model, plugin } = mongoose;

// Define a global plugin that makes all fields required (unless they already have a requiremenet specifically set)
const intoRequired = schema =>
	Object.values(schema.paths).forEach(path =>
		path.isRequired === undefined ? path.required(true) : null
	);

plugin(intoRequired);

const schemas = {
	Identity: Schema({
		provider: String,
		name: String,
		photo: String,
		gender: {
			type: String,
			required: false
		},
		_id: String
	}),
	User: Schema({
		admin: Boolean,
		identity: {
			type: String,
			ref: 'Identity'
		}
	}),
	Algorithm: Schema({
		name: String,
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: false
		}
	}),
	Bot: Schema(
		{
			owner: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			},
			algorithm: {
				type: Schema.Types.ObjectId,
				ref: 'Algorithm'
			},
			strengthToUSD: Number,
			encryptedPrivateKey: String,
			worth: [
				{
					timestamp: Number,
					value: Number
				}
			],
			status: {
				name: {
					type: String,
					default: 'running' // paused, tempPaused, stopped, running
				},
				time: {
					type: Number,
					default: 0 // used for tempPaused
				}
			}
		},
		{
			methods: {
				privateKey() {
					const [iv, encrypted] = this.encryptedPrivateKey
						.split(':')
						.map(part => Buffer.from(part, 'hex'));
					const decipher = createDecipheriv('aes-256-cbc', Buffer.from(WALLET_SECRET, 'hex'), iv);
					let decrypted = decipher.update(encrypted);
					decrypted = Buffer.concat([decrypted, decipher.final()]).toString();
					return decrypted;
				}
			}
		}
	)
};

// Using function keyword due to scoping issues
schemas.Bot.pre('save', function encrypt(next) {
	console.log(this);
	if (!this.isModified('encryptedPrivateKey')) return next();

	const iv = randomBytes(16);
	const cipher = createCipheriv('aes-256-cbc', Buffer.from(WALLET_SECRET, 'hex'), iv);
	let encrypted = cipher.update(this.encryptedPrivateKey);
	encrypted = Buffer.concat([encrypted, cipher.final()]);

	this.encryptedPrivateKey = `${iv.toString('hex')}:${encrypted.toString('hex')}`;
	next();
});

const evaluateModel = name => models[name] ?? model(name, schemas[name]);

export let Identity = evaluateModel('Identity');
export let User = evaluateModel('User');
export let Algorithm = evaluateModel('Algorithm');
export let Bot = evaluateModel('Bot');

export const evaluateModelsWhenConnectionReady = async () => {
	if (connection.readyState !== 1)
		await new Promise(res => {
			connection.on('connected', res);
		});

	Identity = evaluateModel('Identity');
	User = evaluateModel('User');
	Algorithm = evaluateModel('Algorithm');
	Bot = evaluateModel('Bot');
};
