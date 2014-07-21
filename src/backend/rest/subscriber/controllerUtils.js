
var validator = require('validator');

function invalidEmail(email){
	//use node-enfore library
	return !validator.isEmail(email);
}

function invalidPassword(password){
	int min = 8;
	int max = 16;
	return !validator.isLength(password, min, max);	
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
