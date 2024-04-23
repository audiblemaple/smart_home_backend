const OTP = require("./model");
const generateOTP = require("../../utils/generateOTP");
const sendEmail = require("../../utils/sendEmail");
const e = require("express");
const {hashData, verifyHashedData} = require("../../utils/hashData");
const {SENDGRID_AUTH_EMAIL} = process.env;


const verifyOTP = async ({email, otp}) => {
	try {
		if (! (email && otp))
			throw Error("email and OTP are required");

		const matchedOTPRecord = await OTP.findOne({email});

		if (! matchedOTPRecord)
			throw Error("No OTP records found");

		const {expiresOn} = matchedOTPRecord;

		if (expiresOn < Date.now()){
			await OTP.deleteOne({email});
			throw Error("OTP code has expired, please request a new one");
		}

		const hashedOTP = matchedOTPRecord.otp;


		return await verifyHashedData( hashedOTP, otp);
			} catch (error) {
		throw error;
	}
}


const sendOTP = async ({ email, subject, message, duration = 1 }) => {
	try {
		if (! ( email && subject && message ))
			throw Error("Must have email, subject and message");

			// clear any old record
			await OTP.deleteOne({email});

			// generate new pin
			const generatedOTP = await generateOTP();

			const mailOptions = {
				to: email,
				from: SENDGRID_AUTH_EMAIL,
				subject: subject,
				text: 'Smart home account verification',
				html: `<p>${message}</p><p style="color: tomato; font-size: 25px; letter-spacing: 2px" > <b>${generatedOTP}</b></p><p><b>This code will expire in ${duration} hour(s).</b></p>`
			};

			await sendEmail(mailOptions);

			// save
			const hashedOTP = await hashData(generatedOTP);
			const newOTP = await new OTP({
				email,
				otp: hashedOTP,
				createdAt: Date.now(),
				expiresOn: Date.now() + 3600000 * +duration
			});

			return await newOTP.save();

	} catch (error){
		throw error;
	}
}

const deleteOTP = async (email) => {
	try {
		await OTP.deleteOne({email});
	} catch (error) {
		throw error;
	}
};


module.exports = {sendOTP, verifyOTP, deleteOTP};