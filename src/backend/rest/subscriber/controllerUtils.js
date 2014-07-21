
var validator = require('vallidator');

function invalidEmail(email){
	//use node-enfore library
	return !validator.isEmail(email);
}

function invalidPassword(password){
	return !validator.isLength(password, 8, 16);	
}
//function validToken(token){
//	checks.add("testToken", enforce.ranges.length(36, 36, "bad token"))
//	checks.check({
//		testToken : token
//	}, function (err) {
//		console.log(err);
//	});
//}

exports.invalidPassword = invalidPassword;
exports.invalidEmail = invalidEmail;
//exports.validToken = validToken;
