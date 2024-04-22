const User = require("./model")
const {hashData, verifyHashedData} = require("../../utils/hashData");
const createToken = require("../../utils/createToken");
const { createReadStream } = require('fs');
const { v4: uuidv4 } = require('uuid');

const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	}
});

const authenticateUser = async (data) => {
	try {
		const {email, password} = data;

		const fetchedUser = await User.findOne({ email });

		if (! fetchedUser) throw Error("Invalid Email");
		if (!fetchedUser.verified) throw Error("Email is not verified, please check your inbox");

		const hashedPassword = fetchedUser.password;

		if (! await verifyHashedData(hashedPassword, password)) throw Error("Invalid Password");

		// create user token
		fetchedUser.token = await createToken({userId: fetchedUser._id, email});
		return fetchedUser;

	} catch (error){
		throw error;
	}
}

const createNewUser = async (data) => {
	try {
		const { name, email, password, dateOfBirth, model } = data;

		// Check if user exists
		const existingUser = await User.findOne({email});

		if (existingUser) throw Error("User already exist.");

		// Hash password
		const hashedPassword = await hashData(password);

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
			dateOfBirth: dateOfBirth,
			models: [{
				URL: model ? await uploadToAWSS3(model) : "noModel"
			}]
		});
		return await newUser.save();
	} catch (error){
		throw error;
	}
}



const uploadToAWSS3 = async (file) => {
	try {
		// Ensure that filepath is defined and points to a location
		if (!file || !file[0].filepath) throw new Error("File path is missing or the file object is undefined.");

		// Make sure the createReadStream is available
		if (!createReadStream) throw new Error("File system read stream is not available.");

		const fileStream = createReadStream(file[0].filepath);

		const upload = new Upload({
			client: s3Client,
			params: {
				Bucket: process.env.S3_BUCKET_NAME,
				Key: `${uuidv4()}@$@$@${file[0].originalFilename}`,
				Body: fileStream
			}
		});

		const result = await upload.done();
		return result.Location;
	} catch (error) {
		console.error("Error uploading file:", error);
		throw error;
	}
}
module.exports = {createNewUser, authenticateUser}
























// const User = require("./model")
// const {hashData, verifyHashedData} = require("../../utils/hashData");
// const createToken = require("../../utils/createToken");
//
//
// const authenticateUser = async (data) => {
// 	try {
// 		const {email, password} = data;
//
// 		const fetchedUser = await User.findOne({ email });
//
// 		if (! fetchedUser)
// 			throw Error("Invalid Email");
//
// 		if (!fetchedUser.verified) throw Error("Email is not verified, please check your inbox");
//
// 		const hashedPassword = fetchedUser.password;
//
// 		if (! await verifyHashedData(hashedPassword, password))
// 			throw Error("Invalid Password");
//
// 		// create user token
// 		fetchedUser.token = await createToken({userId: fetchedUser._id, email});
// 		return fetchedUser;
//
// 	} catch (error){
// 		throw error;
// 	}
// }
//
// const createNewUser = async (data) => {
// 	try {
// 		const { name, email, password, dateOfBirth, model } = data;
//
// 		console.log(name)
// 		console.log(email)
// 		console.log(password)
// 		console.log(dateOfBirth)
// 		console.log(model)
//
// 		// Check if user exists
// 		const existingUser = await User.findOne({email});
//
// 		if (existingUser)
// 			throw Error("User already exist.");
//
// 		// Hash password
// 		const hashedPassword = await hashData(password);
//
//
//
// 		// uploadToAWSS3(houseModel);
//
// 		const newUser = new User({
// 			name,
// 			email,
// 			password: hashedPassword,
// 			dateOfBirth: dateOfBirth
// 		});
// 		return await newUser.save();
// 	} catch (error){
// 		throw error;
// 	}
// }
//
//
// const uploadToAWSS3 = async (file) => {
// 	try {
// 		console.log(file);
// 	} catch (error){
// 		throw error;
// 	}
// }
//
//
//
// module.exports = {createNewUser, authenticateUser}










