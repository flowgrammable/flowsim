var msg = require('./msg');

var insertSubscriber = function(email, password, cb){
	console.log('hit insertSubscriber');
	setTimeout(function(){
		console.log('sub timer');
		cb(msg.success('could not insert'));
	}, 3000);
}

function sendEmail(email, cb){
	setTimeout(function(){
		console.log('email timer');
		cb(msg.success('sent email'))
	}, 3000);
}

exports.sendEmail = sendEmail;
exports.insertSubscriber = insertSubscriber;