
var enforce = require('enforce');

function validEmail(email){
	//use node-enfore library
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
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
