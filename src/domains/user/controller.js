const User = require("./model")
const {hashData, verifyHashedData} = require("../../utils/hashData");
const createToken = require("../../utils/createToken");


const authenticateUser = async (data) => {
	try {
		const {email, password} = data;

		const fetchedUser = await User.findOne({ email });

		if (! fetchedUser)
			throw Error("Invalid Email");

		if (!fetchedUser.verified) throw Error("Email is not verified, please check your inbox");

		const hashedPassword = fetchedUser.password;



		if (! await verifyHashedData(hashedPassword, password))
			throw Error("Invalid Password");

		// create user token
		fetchedUser.token = await createToken({userId: fetchedUser._id, email});
		return fetchedUser;

	} catch (error){
		throw error;
	}
}


const createNewUser = async (data) => {
	try {
		const { name, email, password, dateOfBirth } = data;

		// Check if user exists
		const existingUser = await User.findOne({email});

		if (existingUser)
			throw Error("User already exist.");

		// Hash password
		const hashedPassword = await hashData(password);

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
			dateOfBirth: dateOfBirth
		});
		return await newUser.save();
	} catch (error){
		throw error;
	}
}

module.exports = {createNewUser, authenticateUser}