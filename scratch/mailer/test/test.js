var mailer = require('../mailer');
var assert = require('assert');

describe('flowsim mailer', function(){
	it('should return AuthError when invalid credentials are specified', function(){
	var mailerConfig = {
		service: 'gmail',
		auth: {
			user: 'flowgrammablemailer@gmail.com',
			pass: 'dfafaflogtester2014'
		      }
	}
	var messageOptions = {
		from: 'flog mailer',
		to: 'coltonchojnacki@gmail.com',
		text: 'test message from flowsim mailer'
	}
	mailer.sendMessage(mailerConfig, messageOptions, function(err,done){
		assert.equal('Authasdfaf', err);
		done();
	});
	});
});	
