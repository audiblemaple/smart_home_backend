const express = require("express");
const router = express.Router();
const {createNewUser, authenticateUser, uploadToAWSS3, addModelToUsersList, removeModelFromUserList} = require("./controller");

const auth= require("../../middleware/auth");
const {sendVerificationOTPEmail} = require("../email_verification/controller");
const formidable = require("formidable");

// private route
router.get("/private_route", auth, (req, res) => {
	res.status(200).send(`you are in the private territory of ${req.currentUser.email}`);
});

// Login
router.post("/", async (req, res) => {
	try {
		let { email, password } = req.body;
		email = email.trim();
		password = password.trim();

		if (! (email && password)) throw Error("One or mode Fields are empty")

		const authenticatedUser = await authenticateUser({email, password});
		res.status(200).json({status: "success", message: "Login successful", user: authenticatedUser});

	} catch (error) {
		res.status(400).json({status: "fail", message: error.message});
	}
});


// Signup
router.post("/signup", async (req, res) => {
	try {
		const form = new formidable.IncomingForm();
		const [fields, files] = await form.parse(req);

		let { name, email, password, dateOfBirth } = fields;

		name = name[0].trim();
		email = email[0].trim();
		password = password[0].trim();
		dateOfBirth = dateOfBirth[0].trim();
		const model = files.file;

		if (!name)
			throw Error("Name field is empty")
		if (!email)
			throw Error("Email field is empty")
		if (!password)
			throw Error("password field is empty")
		if (!dateOfBirth)
			throw Error("Date of birth field is empty")


		if (!/^[a-zA-Z ]*$/.test(name)) throw Error("invalid name")
		if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) throw Error("invalid email");
		if (password.length < 8) throw Error("password too short");

		// good credentials
		const newUser = await createNewUser({
			name,
			email,
			password,
			dateOfBirth,
			model
		});

		await sendVerificationOTPEmail(email);

		res.status(200).json({status: "success", message: "Signup successful", data: newUser});
	} catch (error) {
		res.status(400).json({status: "fail", message: error.message} );
	}
});

router.post("/UploadModel", async (req, res) => {
	try {
		const form = new formidable.IncomingForm();
		const [fields, files] = await form.parse(req);

		let { email } = fields;

		email = email[0].trim();
		const model = files.file;

		if (!email)
			throw Error("No Email provided");

		const awsResult = await uploadToAWSS3(model);
		const {URL, AWSKey} = awsResult
		const newModel = { URL: URL, AWSKey };
		const updatedUser = await addModelToUsersList(email, newModel);

		res.status(200).json({status: "success", message: "Model added successfully", data: updatedUser});
	} catch (error) {
		res.status(400).json({status: "fail", message: error.message} );
	}
});

router.post("/RemoveModel", async (req, res) => {
	try {
		let { email, key } = req.body;
		email = email.trim();
		key = key.trim();
		if (!email)
			throw Error("No Email provided, cannot remove model from list");
		if (!key)
			throw Error("No key provided, cannot remove model from list");

		const result = await removeModelFromUserList(email, key);
		let {modifiedCount, matchedCount} = result;

		console.log(result);

		if (modifiedCount === 0 && matchedCount === 1)
			throw Error('No model was removed, it might have been removed previously or did not exist');
		if (modifiedCount === 0)
			throw Error("Model was not removed");

		res.status(200).json({status: "success", message: "Model removed successfully", data: result});
	} catch (error) {
		res.status(400).json({status: "fail", message: error.message});
	}
});

module.exports = router;