import mongoose from 'mongoose';
const { Schema, model, models, plugin } = mongoose;

// Define a global plugin that makes all fields required (unless they already have a requiremenet specifically set)
const intoRequired = schema =>
	Object.values(schema.paths).forEach(path =>
		path.isRequired === undefined ? path.required(true) : null
	);
plugin(intoRequired);

const identitySchema = Schema({
	provider: String,
	name: String,
	photo: String,
	gender: {
		type: String,
		required: false
	},
	_id: String
});

const userSchema = Schema({
	admin: Boolean,
	identity: {
		type: String,
		ref: 'Identity'
	}
});

const algorithmSchema = Schema({
	name: String,
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: false
	}
});

const botSchema = Schema(
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
		]
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
);

botSchema.pre('save', next => {
	// @TODO encrypt private key
	next();
});

export const Identity = models.Identity ?? model('Identity', identitySchema);
export const User = models.User ?? model('User', userSchema);
export const Algorithm = models.Algorithm ?? model('Algorithm', algorithmSchema);
export const Bot = models.Bot ?? model('Bot', botSchema);
