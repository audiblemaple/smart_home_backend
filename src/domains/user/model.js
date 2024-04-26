const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: String,
	email: {
		type: String,
		unique: true
	},
	password: String,
	dateOfBirth: String,
	token: String,
	verified: {
		type: Boolean,
		default: false
	},
	models: [{
		URL: {
			type: String,
			default: 'noModel'
		},
		AWSKey: {
			type: String,
			default: 'noKey'
		},
		initialRotationVal: {
			type: Number,
			default: 0.0001
		}
	}],
	selectedModelIndex: {
		type: Number,
		default: 0
	}
});

const User = mongoose.model("User", UserSchema);

module.exports = User