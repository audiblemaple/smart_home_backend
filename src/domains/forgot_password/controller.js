const User = require("../user/model");
const {sendOTP, verifyOTP, deleteOTP} = require("../otp/controller");
const {hashData} = require("../../utils/hashData");


const resetUserPassword = async ({email, otp, newPassword}) => {
	try {

		if (!await verifyOTP({email, otp})) throw Error("Invalid code passed, please check your inbox");

		if (newPassword.length < 8) throw Error("Password must be at least 8 characters long");

		await User.updateOne({email}, {password: await hashData(newPassword)})
		return await deleteOTP(email);

	} catch (error){
		throw error;
	}
};

const sendPasswordResetOTPEmail = async (email) => {
	try {

		// check if account exists
		const existingUser = await User.findOne({email});
		if (! existingUser) throw Error("There's no account for the provided email");

		if (!existingUser.verified) throw Error("Email has not been verified yet, please check your inbox");

		const otpDetails = {
			email,
			subject: "Password Reset",
			message: "Enter the code below to reset your password",
			duration: 1
		}
		return await sendOTP(otpDetails)

	} catch (error){
		throw error;
	}
};

module.exports = {sendPasswordResetOTPEmail, resetUserPassword};