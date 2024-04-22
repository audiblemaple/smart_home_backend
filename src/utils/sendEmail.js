const nodeMailer = require("nodemailer");
const OTP = require("../domains/otp/model");
const generateOTP = require("./generateOTP");
const {AUTH_EMAIL_SENDGRID, AUTH_PASS_SENDGRID} = process.env;


let transporter = nodeMailer.createTransport({
	host: "smtp-mail.outlook.com",
	auth: {
		user: AUTH_EMAIL_SENDGRID,
		pass: AUTH_PASS_SENDGRID
	}
});

// TODO: fix the email functionality, currently my outlook account is blocked its blocked
transporter.verify((error, success) => {
	if (error)
		console.log(error);
	else{
		console.log("Initialized emailer.");
	}
});

const sendEmail = async (mailOptions) => {
	try {
		return await transporter.sendMail(mailOptions);
	} catch (error){
		throw error;
	}
}

module.exports = sendEmail;