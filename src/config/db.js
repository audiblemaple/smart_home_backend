require("dotenv").config();

const mongoose = require("mongoose");

// uri
const {MONGODB_URI} = process.env;

const connectToDB = async () => {
	try	{
		await mongoose.connect(MONGODB_URI);
	} catch (error) {
		console.log(error);
	}
};

connectToDB().then(r => {
	console.log("Connection to database: success.")
});
