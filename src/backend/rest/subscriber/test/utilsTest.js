
var utils = require('../controllerUtils.js');
var assert = require('assert');
describe('===> Utils Test: \n', function(){
	var badEmail = "ojh12345@gmail";
	it('Test passing invalid email should return true', function(done){
		assert.equal(utils.invalidEmail(badEmail), true);
		done();
	});

	var badPass = '2short';
	it('Test passing invalid password should return true (not 8-16 chars)', function(done){
		assert.equal(utils.invalidPassword(badPass), true);
		done();
	});

	var badToken = 'not36chaaracters';
	it('Test passing invalid token should return true (not 36 characters)', function(done){
		assert.equal(utils.invalidToken(badToken), true);
		done();
	});
});
