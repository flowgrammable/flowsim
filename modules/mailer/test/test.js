var mailer = require('../index.js');
var assert = require('assert');


var mailerConfig = {
	service: 'gmail',
	auth: {
		user: 'flowgrammablemailer@gmail.com',
		pass: 'dflowtester'
	}
}
var messageOptions = {
		from: 'flog mailer',
		to: 'ash.1382@gmail.com',
		text: 'test message from flowsim mailer'
	}
	
describe('flowsim mailer', function(){
    it('should return AuthError when invalid credentials are specified', function(done){
        mailer.sendMessage(mailerConfig, messageOptions, function(err){
            assert.equal('AuthError', err);
            done();
        });
	});
});	
