//utils Test
var utils = require('../controllerUtils.js');
var assert = require('assert');

//email tests
//invalid email returns false
var badEmail = "ojh12345@gmail";
var goodEmail = "ojh12345@yahoo.com";
if(utils.invalidEmail(badEmail)) console.log("bad email");
if(!utils.invalidEmail(goodEmail)) console.log("good email");


//password test
//invalid password return false, needs to be 8-16 characters
var badPass = "1234";
var goodPass = "1234567890";
if(utils.invalidEmail(badPass)) console.log("bad password");
if(!utils.invalidEmail(goodPass)) console.log("good password");

//token test
//invalid token returns false, needs to be 36 characters
//var badToken = "1245720983";
//var goodToken = "123456789012345678901234567890123456";
//assert.equal(utils.validToken(badToken), false, ['invalid token']);
//assert.equal(utils.validToken(goodToken), true, ["valid token"]);
