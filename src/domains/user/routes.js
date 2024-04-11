const express = require("express");
const router = express.Router();
const {createNewUser, authenticateUser} = require("./controller");

const auth= require("../../middleware/auth");
const {sendVerificationOTPEmail} = require("../email_verification/controller");

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
		res.status(200).json({status: "success", message: "Login successful", authenticatedUser});

	} catch (error) {
		res.status(400).json({status: "fail", message: error.message, authenticatedUser: "noUser"});
	}
});


// Signup
router.post("/signup", async (req, res) => {
	try {
		let { name, email, password, dateOfBirth } = req.body;
		name = name.trim();
		email = email.trim();
		password = password.trim();
		dateOfBirth= dateOfBirth.trim();

		if (! (name && email && password && dateOfBirth)) throw Error("One or mode Fields are empty")
		if (!/^[a-zA-Z ]*$/.test(name)) throw Error("invalid name")
		if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) throw Error("invalid email");
		if (password.length < 8) throw Error("password too short");

		// good credentials
		const newUser = await createNewUser({
			name,
			email,
			password,
			dateOfBirth
		});

		await sendVerificationOTPEmail(email);
		res.status(200).json({status: "success", message: "Signup successful", user: newUser});
	} catch (error) {
		res.status(400).json(error.message);
	}
});

module.exports = router;