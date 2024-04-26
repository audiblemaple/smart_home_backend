const express = require("express");
const e = require("express");
const {sendPasswordResetOTPEmail, resetUserPassword} = require("./controller");
const router = express.Router();

router.post("/reset", async (req, res) => {
	try {
		let {email, otp, newPassword} = req.body;
		console.log(req.body);

		if (! (email && otp && newPassword)) throw Error("Email, otp and password must be supplied");

		await resetUserPassword({email, otp, newPassword});
		res.status(200).json({status: "success", message: "Password changed successfully"});
	} catch (error){
		res.status(400).json(error.message);
	}
});


router.post("/", async (req, res) => {
	try {
		const {email} = req.body;

		if (!email) throw Error("An email is required.");

		const createdPasswordResetOTP = await sendPasswordResetOTPEmail(email);
		res.status(200).json({status: "success", message: "New password OTP sent", data: createdPasswordResetOTP});
	} catch (error){
		// res.status(400).json(error.message);
		res.status(400).json({status: "fail", message: error.message});
	}
});

module.exports = router;