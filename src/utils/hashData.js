const bcrypt = require("bcrypt");


const hashData = async (data, saltRounds = 10) => {
	try {
		return  await bcrypt.hash(data, saltRounds);
	} catch (error){
		throw error;
	}
}

const verifyHashedData = async (hashed, unHashed) => {
	try {
		return await bcrypt.compare(unHashed, hashed);
	} catch (error){
		throw error;
	}
}


module.exports = { hashData, verifyHashedData };