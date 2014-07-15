
var enforce = require("enforce");

function validEmail(email){
	//use node-enfore library
	enforce.patterns.email([email])
}

function validPassword(password){
	enforce.security.password([[ luns8, ]password ])
}

function validToken(token){
	enforce.ranges.length(36[, 36[, token ]])
}

exports.validPassword = validPassword;
exports.validEmail = validEmail;
exports.validToken = validToken;
