var orm = require('../../../dbbs');
var Subscriber = orm.model("subscriber");
var request = require('request');
var assert = require('assert');
var fs = require('fs');

orm.setup()

var testEmail = 'test@gmail.com';
var token, resetToken;

// ----------------------------------------------------------------------------
// Testing registration
describe('Testing registration requests:',function() {
  it('User registered successfully',function(done) {
//    this.timeout(5000);
    request( {
      url: 'http://localhost:3000/api/subscriber/register',
      body: '{ \"email\": \"'+testEmail+'\", \"password\": \"my password\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert(JSON.parse(body)['value'],'Unable to register user');
      console.log('\tResponse received : ', body);
      fs.exists(process.cwd()+'/temp', function (exists) {
        if(exists) {
          fs.readFile(process.cwd()+'/temp','utf8',function (err,data) {
            if (err) console.log('Unable to read token in file for restTest');
            else{ token = data;}
          });
        }
      });
      done();
    }); 
  });
  it('Email Already in Use',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/register',
      body: '{ \"email\": \"'+testEmail+'\", \"password\": \"my password\", \"ip\": \"192.162.0.8\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'emailInUse');
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('Bad Password',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/register',
      body: '{ \"email\": \"Something@gmailler.com\", \"password\": \"my\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'badPwd');
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('Bad email',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/register',
      body: '{ \"email\": \"asdf.com\", \"password\": \"my password\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'badEmail');
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('Missing Password',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/register',
      body: '{ \"email\": \"'+testEmail+'\", \"password\": \"\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'missingPwd');
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('Missing Email',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/register',
      body: '{ \"email\": \"\", \"password\": \"my password\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'missingEmail');
      console.log('\tResponse received : ', body);
      done();
    });
  });
});

// ----------------------------------------------------------------------------
// Testing verification
describe('Testing verification requests:',function() {
  it('User verified successfully',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/verify/',
      body: '{ \"token\": \"'+token+'\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) { 
      console.log('\tResponse received : ', body);
			assert(JSON.parse(body)['value'],'Unable to verify user');
      done();
    });
  });

  it('User already verified',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/verify/',
	    body: '{ \"token\": \"'+token+'\"}',
	    headers: { 'Content-Type': 'application/json'},
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'subscriberAlreadyVerified');
      console.log('\tResponse received : ', body);
      done();
    });
  });

  it('Missing verification token',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/verify/',
	    body: '{ \"token\": \"'+''+'\"}',
	    headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'missingVerificationToken');
      console.log('\tResponse received : ', body);
      done();
    });
  });

  it('Bad verification token',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/verify/Bad-Token',
	    body: '{ \"token\": \"'+'bad_token'+'\"}',
	    headers: { 'Content-Type': 'application/json'},
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'badVerificationToken');
      console.log('\tResponse received : ', body);
      done();
    });
  });
});

// ----------------------------------------------------------------------------
// Testing login
var session;
describe('Testing subscriber login:',function() {
  // Register a subscriber for use in the 'Unverified subscriber' test
  before(function() {
    
  });
  it('Subscriber logged in successfully',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/login',
      body: '{ \"email\": \"'+testEmail+'\", \"password\": \"my password\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert(JSON.parse(body)['value'],'Unable to login user');
      console.log('\tResponse received : ', body);
      session = JSON.parse(body)['value'];
      done();
    });
  });
  it('Missing Subscriber\'s Email Address',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/login',
      body: '{ \"email\": \"\", \"password\": \"my password\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'missingEmail');
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('Invalid Email Address',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/login',
      body: '{ \"email\": \"a-terriblest-email\", \"password\": \"my password\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'badEmail');
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('Incorrect password',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/login',
      body: '{ \"email\": \"'+testEmail+'\", \"password\": \"badPassword\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'incorrectPwd');
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('Test: Logging in with an unregistered user should return {msg.subscriberNotFound()}',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/login',
      body: '{ \"email\": \"'+'unregistered@gmail.com'+'\", \"password\": \"my password\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'subscriberNotFound');
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('Test: Logging in with an unverified subscriber should return {msg.subscriberNotActive()}', function(done) {
    // First register the user, without verifying
    request( {
      url: 'http://localhost:3000/api/subscriber/register',
      body: '{ \"email\": \"valid_email@gmail.com\", \"password\": \"my password\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      console.log('\tBefore response received : ', body);
      // Now try to login with the unverified user
      request( {
        url: 'http://localhost:3000/api/subscriber/login',
        body: '{ \"email\": \"valid_email@gmail.com\", \"password\": \"my password\"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      }, function (error, response, body) {
        assert.equal(JSON.parse(body)['error']['type'],'subscriberNotActive');
        console.log('\tResponse received : ', body);
        done();
      });
    });
  });
  it('Test: logging in with out a password should return msg.missingPassword',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/login',
      body: '{ \"email\": \"'+testEmail+'\", \"password\": \"\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
	console.log('\tResponse received : ', body);
      assert.equal(JSON.parse(body)['error']['type'],'missingPwd');
//      console.log('\tResponse received : ', body);
      done();
    });
  });
});


describe('Testing subscriber logout:',function() {
  it('Subscriber logged out successfully',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/logout',
      body: '{ \"email\": \"'+testEmail+'\", \"password\": \"my password\"}',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': session
      },
      method: 'POST'
    }, function (error, response, body) {
      //assert(JSON.parse(body)['value'],'Unable to logout user');
      console.log('\tResponse received : ', body);
      done();
    });
  });
});


// ----------------------------------------------------------------------------
// Testing forgot password phase one
describe('Testing forgot password requests:',function() {
  it('A successful forgot password request should return msg.success()',
     function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/forgotpassword/',
      body: '{ \"email\": \"'+testEmail+'\" }',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) { 
      assert(JSON.parse(body)['value'],'Unable to request password reset');
      fs.exists(process.cwd()+'/temp', function (exists) {
        if(exists) {
          fs.readFile(process.cwd()+'/temp','utf8',function (err,data) {
            var array = data.toString().split("\n");
            if (err) console.log('Unable to read token in file for restTest');
            else resetToken = JSON.parse(array[1]).reset_token;
          });
        }
      });
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('A forgot password request without an email should return '+
     'msg.missingEmail()',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/forgotpassword/',
      body: '{ \"email\": \"\" }',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) { 
      assert.equal(JSON.parse(body)['error']['type'],'missingEmail');
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('A forgot password request with an invalid email should return '+
     'msg.badEmail()',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/forgotpassword/',
      body: '{ \"email\": \"invalid_email\" }',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) { 
      assert.equal(JSON.parse(body)['error']['type'],'badEmail');
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('A forgot password request with an email not linked to a subscriber '+
     'should return msg.subscriberNotFound()',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/forgotpassword/',
      body: '{ \"email\": \"nonexistent@gmail.com\" }',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) { 
      assert.equal(JSON.parse(body)['error']['type'],'subscriberNotFound');
      console.log('\tResponse received : ', body);
      done();
    });
  });
});

// ----------------------------------------------------------------------------
// Testing forgot password phase two
//
// Note: keep the successful test at the bottom so that the subscriber
// remains in the 'RESET' state containing the token
describe('Testing reset password requests:',function() {
  it('A reset password request with a missing reset token should return '+
     'msg.missingResetToken()',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/resetpassword/',
      body: '{ \"reset_token\":\"\",\"password\":\"new pwd\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) { 
      assert.equal(JSON.parse(body)['error']['type'],'missingResetToken');
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('A reset password request with an invalid reset token should return '+
     'msg.badResetToken()',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/resetpassword/',
      body: '{ \"reset_token\":\"invalid token\",\"password\":\"new pwd\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) { 
      assert.equal(JSON.parse(body)['error']['type'],'badResetToken');
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('A reset password request with a missing password should return '+
     'msg.missingPassword()',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/resetpassword/',
      body: '{ \"reset_token\":\"'+resetToken+'\",\"password\":\"\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) { 
      assert.equal(JSON.parse(body)['error']['type'],'missingPassword');
      console.log('\tResponse received : ', body);
      done();
    });
  });
    it('A reset password request with a missing password should return '+
     'msg.missingPassword()',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/resetpassword/',
      body: '{ \"reset_token\":\"'+resetToken+'\",\"password\":\"\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) { 
      assert.equal(JSON.parse(body)['error']['type'],'missingPassword');
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('A successful reset password request should return msg.success()',
     function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/resetpassword/',
      body: '{ \"reset_token\":\"'+resetToken+'\",\"password\":\"new pwd\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) { 
      assert(JSON.parse(body)['value'],'Unable to request password reset');
      console.log('\tResponse received : ', body);
      done();
    });
  });
});
