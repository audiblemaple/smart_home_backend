const generateOTP = async () => {
	try {
		let min = 1000;
		let max = 9999;

		return (`${Math.floor(Math.random()  * (max - min) + min )}`);
	} catch (error){
		throw error;
	}
}

module.exports = generateOTP;