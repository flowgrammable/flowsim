var msg = require('./msg');

function insertSubscriber(email, password, cb){
	setTimeout(function(){
		cb(msg.emailInUse());
	}, 3000);
}

function sendEmail(email, cb){
	setTimeout(function(){
		cb(msg.error('Cant send Email'));
	}, 3000);
}

exports.sendEmail = sendEmail;
exports.insertSubscriber = insertSubscriber;