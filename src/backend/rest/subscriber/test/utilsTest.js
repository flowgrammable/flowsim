//utils Test
var utils = require('../controllerUtils.js');
var assert = require('assert');

//email tests
//invalid email returns false
var badEmail = "ojh12345@gmail";
var goodEmail = "ojh12345@yahoo.com";
//utils.validEmail(badEmail);
//utils.validEmail(goodEmail);
assert.equal(utils.validEmail(badEmail), true, ['invalid email']);
assert.equal(utils.validEmail(goodEmail), false, ['valid email']);

//password test
//invalid password return false, needs to be 8-16 characters
var badPass = "1234";
var goodPass = "1234567890";
//utils.validPassword(badPass);
//utils.validPassword(goodPass);
assert.equal(utils.validPassword(badPass), true, ['invalid password']);
assert.equal(utils.validPassword(goodPass), false, ['valid password']);

//token test
//invalid token returns false, needs to be 36 characters
//var badToken = "1245720983";
//var goodToken = "123456789012345678901234567890123456";
//assert.equal(utils.validToken(badToken), false, ['invalid token']);
//assert.equal(utils.validToken(goodToken), true, ["valid token"]);
