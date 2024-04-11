const jwt = require("jsonwebtoken");
const { TOKEN_KEY, TOKEN_EXPIRY } = process.env;

const createToken = async (tokenData, tokenKey = TOKEN_KEY, expiresIn = TOKEN_EXPIRY) => {
	try {
		return await jwt.sign(tokenData, tokenKey, {expiresIn});
	} catch (error){
		throw error;
	}
}

module.exports = createToken;