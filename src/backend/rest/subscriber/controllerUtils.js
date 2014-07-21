
var enforce = require('enforce');
var checks = new enforce.Enforce();
function validEmail(email){
	//use node-enfore library
	checks.add("testEmail", enforce.patterns.email("bad email"))
	checks.check({
		testEmail : email
	}, function (err) {
		console.log(err);
	});
}

function validPassword(password){
	checks.add("testPass", enforce.range.length(8, 16, "bad password"))
	checks.check({
		testPass : password
	}, function (err) {
		console.log(err);
	});
}

function validToken(token){
	checks.add("testToken", enforce.range.length(36, 36, "bad token"))
	checks.check({
		testToken : token
	}, function (err) {
		console.log(err);
	});
}

exports.validPassword = validPassword;
exports.validEmail = validEmail;
exports.validToken = validToken;
