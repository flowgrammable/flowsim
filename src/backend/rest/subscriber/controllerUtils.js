
var enforce = require('enforce');

function validEmail(email){
	//use node-enfore library
	var checks = new enforce.Enforce();
	checks.add("testEmail", enforce.patterns.email("bad email"));
	checks.check({
		testEmail : email
	}, function (err) {
		if(err){
			return true;
		}
		else{
			return false;
		}
	});
}

function validPassword(password){
	var checks = new enforce.Enforce();
	checks.add("testPass", enforce.ranges.length(8, 16, "bad password"));
	checks.check({
		testPass : password
	}, function (err) {
		if(err){
			return true;
		}
		else{
			return false;
		}
	});
}

//function validToken(token){
//	checks.add("testToken", enforce.ranges.length(36, 36, "bad token"))
//	checks.check({
//		testToken : token
//	}, function (err) {
//		console.log(err);
//	});
//}

exports.validPassword = validPassword;
exports.validEmail = validEmail;
//exports.validToken = validToken;
