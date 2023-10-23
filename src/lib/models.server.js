import mongoose from 'mongoose';

const { Schema, model, models, plugin, connection } = mongoose;

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
				type: String, // paused, tempPaused, stopped, running
				time: Number // used for tempPaused
			}
		},
		{
			virtuals: {
				privateKey: {
					get() {
						// @TODO decrypt private key
						return this.encryptedPrivateKey;
					}
				}
			}
		}
	)
};

schemas.Bot.pre('save', next => {
	// @TODO encrypt private key
	next();
});

const evaluateModel = name => models[name] ?? model(name, schemas[name]);

// they are reassigned, but in an eval where eslint cant see them
/* eslint-disable prefer-const */
export let Identity = evaluateModel('Identity');
export let User = evaluateModel('User');
export let Algorithm = evaluateModel('Algorithm');
export let Bot = evaluateModel('Bot');
/* eslint-disable prefer-const */

export const evaluateModelsWhenConnectionReady = async () => {
	if (connection.readyState !== 1)
		await new Promise(res => {
			connection.on('connected', res);
		});

	Object.keys(schemas).forEach(name => {
		// eslint-disable-next-line no-unused-vars
		const modelEvaluation = evaluateModel(name);
		// eslint-disable-next-line no-eval
		eval(`${name} = modelEvaluation`);
	});
};
