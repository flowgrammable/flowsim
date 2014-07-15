


function validEmail(email){
	//use node-enfore library
	enforce.patterns.email([email])
}

function validPassword(password){
	enforce.security.password([[ luns8, ]password ])
}

exports.validPassword = validPassword;
exports.validEmail = validEmail;
