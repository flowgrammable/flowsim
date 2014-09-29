
var validator = require('validator');

function invalidEmail(email){
	//use node-enfore library
	return !validator.isEmail(email);
}

function invalidPassword(password){
	var min = 8;
	var max = 16;
	return !validator.isLength(password, min, max);
	// return !(password.length <= max && password.length >= min)
}

function invalidToken(token){
	return !validator.isLength(token, 36, 36);
}

exports.invalidPassword = invalidPassword;
exports.invalidEmail = invalidEmail;
exports.invalidToken = invalidToken;
