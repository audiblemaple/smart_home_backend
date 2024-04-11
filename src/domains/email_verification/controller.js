const User = require("../user/model");
const {sendOTP, verifyOTP, deleteOTP} = require("../otp/controller");


const verifyUserEmail = async ({email, otp}) => {
	try {
		if (! await verifyOTP(({email, otp}))) throw Error("Invalid code passed, please check your inbox");

		await User.updateOne({email}, {verified: true});

		return await deleteOTP(email);
	} catch (error) {
		throw error;
	}
}

const sendVerificationOTPEmail = async (email) => {
	try {

		const existingUser = await User.findOne({email});

		if (! existingUser) throw Error("User not found");

		const otpDetails = {
			email,
			subject: "Email Verification",
			message: "Verify your email with the code below.",
			duration: 1
		}
		return await sendOTP(otpDetails);
	} catch (error) {
		throw error;
	}
}

module.exports = { sendVerificationOTPEmail, verifyUserEmail };