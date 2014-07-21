//utils Test
var utils = require('../controllerUtils.js');
var assert = require('assert');

//email tests
var badEmail = "ojh12345@gmail";
var goodEmail = "ojh12345@yahoo.com";
if(utils.invalidEmail(badEmail)) console.log("bad email");
if(!utils.invalidEmail(goodEmail)) console.log("good email");


//password test
var badPass = "1234";
var goodPass = "password";
if(utils.invalidPassword(badPass)) console.log("bad password");
//console.log(utils.invalidEmail(goodPass));
if(!utils.invalidPassword(goodPass)) console.log("good password");

//token test
//invalid token returns false, needs to be 36 characters
//var badToken = "1245720983";
//var goodToken = "123456789012345678901234567890123456";
//assert.equal(utils.validToken(badToken), false, ['invalid token']);
//assert.equal(utils.validToken(goodToken), true, ["valid token"]);
