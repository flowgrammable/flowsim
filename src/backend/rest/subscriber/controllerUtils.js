
var enforce = require("enforce");

function validEmail(email){
	//use node-enfore library
	return enforce.patterns.email([email])
}

function validPassword(password){
	return enforce.range.length(8[, 16[, password ]])
}

function validToken(token){
	return enforce.ranges.length(36[, 36[, token ]])
}

exports.validPassword = validPassword;
exports.validEmail = validEmail;
exports.validToken = validToken;
