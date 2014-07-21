
var enforce = require('enforce');

function validEmail(email){
	//use node-enfore library
	var checks = new enforce.Enforce();
	checks.add("testEmail", enforce.patterns.email({      
	      'error': {
	        'type': 'Registration',
	        'description': 'Could not register user',
	        'data': {
	          'code': 1103,
	          'message': 'Invalid Email'
	        }
	      }
	    }));
	checks.check({
		testEmail : email
	}, function (err) {
		if(err){
			console.log(JSON.stringify(err.msg));
		}
	});
}

function validPassword(password){
	var checks = new enforce.Enforce();
	checks.add("testPass", enforce.ranges.length(8, 16, {
	      'error': {
	        'type': 'Registration',
	        'description': 'Could not register user',
	        'data': {
	          'code': 1104,
	          'message': 'Password is not 8-16 chars'
	        }
	      }
	    }));
	checks.check({
		testPass : password
	}, function (err) {
		if(err){
			console.log(JSON.stringify(err.msg));
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
