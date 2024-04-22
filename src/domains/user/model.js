const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// TODO: verified should be false, its for debug purposes..
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
		default: true
	},
	models: [{
		URL: {
			type: String,
			default: 'noModel'
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