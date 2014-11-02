var mocha = require('mocha');
var assert = require('assert');
var uuid = require('node-uuid');

var client = require('../../client');
var testUtils = require('../../test/utils');
var msg = require('../msg');
var st = require('./../storage');
var pg = require('../../database/pg');
var logger = require('../../logger/loggerStub');
var log = new logger.Logger();


var db = new pg.Database({database:{
  user: 'flogdev',
  pwd: 'flogdev',
  host: 'localhost',
  database: 'flowsim'
}}, log);

var store = new st.Storage(db, log);

// Provide a test email address
var testEmail = '';

var url = 'https://127.0.0.1:8081/api/';

/*
 * Subscriber Test Suite
 *
 * This test suite covers /api/subscriber endpoints
 */
describe('Subscriber', function(){

  /*
   * Before testing can begin the database must be cleared of entries
   * from the following tables:
   * - subscriber
   * - session
   * - packet
   * - profile
   */
  before(function(done){
    testUtils.clearTables(['profile','packet', 'session', 'subscriber'],
      function(err, result){
        if(err){
          console.log(err);
        } else {
          done();
        }
      });
  });

/**
 * Subscriber Registration Tests
 *   1. Subscriber can register sucessfully
 *   2. Subscriber cannot register same email twice
 *   3. Subscriber cannot register with a malformed email address
 *   4. Subscriber cannot register with a malformed password
 */
describe('/api/subscriber/register', function(){

  /*
   *  1. Subscriber can register successfully
   *
   *  Description:
   *    A subscriber should be able to successfully register an account by
   *    performing a HTTP POST request to /api/subscriber/register
   *
   *  Test Setup:
   *    Subscriber attempting to register should not already be registered
   *    HTTP POST body: {email: "valid@email.com", password: "aValidPassword"}
   *
   *  Expected Response:
   *    msg.success()
   */
  var subscriber = {email:testEmail, password: 'testpass'};
  it('should return msg.success() on user registration', function(done){
    client.query('subscriber/register', 'POST', {}, subscriber, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert(body.value);
        done();
      }
    });
  });

  /*
   *  2. Subscriber cannot register the same email twice
   *
   *  Description:
   *    A subscriber should not be able to register the same email twice.
   *
   *  Test Setup:
   *    A subscriber should already be registered (Test 1)
   *    HTTP POST body: {email: "valid@email.com", password: "aValidPassword"}
   *
   *  Expected Response:
   *    msg.existingEmail()
   */
  it('should return msg.existingEmail() on duplicate registration', function(done){
    client.query('subscriber/register', 'POST', {}, subscriber, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.existingEmail().message);
        done();
      }
    });
  });

  /*
   *  3. Subscriber cannot register with a malformed email
   *
   *  Description:
   *    A subscriber should not be able to register with a malformed email
   *
   *  Test Setup:
   *    HTTP POST body: {email: "malformedEmail", password: "aValidPassword"}
   *
   *  Expected Response:
   *    msg.malformedEmail()
   */
  var malformedSub = {email:'notaemail', password: 'apassword'};
  it('should return msg.malformedEmail() for malformed email', function(done){
    client.query('subscriber/register', 'POST', {}, malformedSub, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.malformedEmail().message);
        done();
      }
    });
  });

  /*
   *  4. Subscriber cannot register with a malformed password
   *
   *  Description:
   *    A subscriber should not be able to register with a malformed password.
   *    The password must be 8-16 characters
   *
   *  Test Setup:
   *    HTTP POST body: {email: "email@domain.com", password: "not8"}
   *
   *  Expected Response:
   *    msg.malformedPassword()
   */
  var malformedSub1 = {email:'email@email.com', password: 'emp'};
  it('should return msg.malformedPassword() for malformed email', function(done){
    client.query('subscriber/register', 'POST', {}, malformedSub1, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.malformedPassword().message);
        done();
      }
    });
  });

  /*
   *  5. Subscriber cannot register without an email
   *
   *  Description:
   *    A subscriber should not be able to register without an email in the
   *    body of the HTTP POST request
   *
   *  Test Setup:
   *    HTTP POST body: {password: "aPassword"}
   *
   *  Expected Response:
   *    msg.missingEmail()
   */
  var malformedSub2 = { password: 'emp'};
  it('should return msg.missingEmail() for missing email field', function(done){
    client.query('subscriber/register', 'POST', {}, malformedSub2, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.missingEmail().message);
        done();
      }
    });
  });

  var malformedSub3 = { email: 'user@mail.com'};
  it('should return msg.missingPassword() for missing password field', function(done){
    client.query('subscriber/register', 'POST', {}, malformedSub3, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.missingPassword().message);
        done();
      }
    });
  });

});

/**
 * Subscriber Login Tests
 *   1. Subscriber who has not been verified should not be able to login
 */
describe('Logging in with a subscriber in CREATED state', function(){

  /**
   * Test Setup
   *
   * Before testing can begin database must be cleared of entries, and
   * a subscriber must be registered, but not verified.
   *
   */
  before(function(done){
    testUtils.clearTables(['profile','packet', 'session', 'subscriber'],
      function(err, result){
        if(err){
          console.log(err);
        } else {
          var subscriber = {email:testEmail, password: 'testpass'};
          client.query('subscriber/register', 'POST', {}, subscriber, function(err, res, body){
            if(err){
              console.log(err);
            } else {
              assert(body.value);
              done();
            }
          });
        }
      });
  });

  /*
   *  1. A Subscriber in CREATED state should not be able to login
   *
   *  Description:
   *    A subscriber who has not been verified should not be able to login
   *
   *  Test Setup:
   *    A subscriber is registered, but not verified. (Sub in CREATED State)
   *    HTTP POST body: {email: testEmail, password: 'testpass'}
   *
   *  Expected Response:
   *    msg.subscriberNotVerified()
   */
  it('should result in msg.subscriberNotVerified()', function(done){
    var login = {email:testEmail, password: 'testpass'};
    client.query('subscriber/login', 'POST', {}, login, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.subscriberNotVerified().message);
        done();
      }
    });
  });

});

/**
 * Subscriber Verify Tests
 *   1. Subscriber that successfully verifies should return success
 *   2. Subscriber trying to verify with a duplicate token should return error
 *   3. Subscriber trying to verify without a token field should return error
 */
describe('/verify', function(){

  /**
   * Before testing can begin, the verification token must be retrieved from
   * the database.
   */
  var verificationToken;
  before(function(done){
    store.getSubscriberByEmail(testEmail, function(err, result){
      if(err){
        console.log(err);
      } else {
        verificationToken = result.verification_token;
        done();
      }
    });
  });

  /**
   * 1. Subscriber that successfully verifies should return success
   */
  it('successful verification should result in msg.success()', function(done){
    var token = {token: verificationToken};
    client.query('subscriber/verify', 'POST', {}, token, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert(body.value);
        done();
      }
    });
  });

  /**
  * 2. Subscriber trying to verify with a duplicate token should return error
  */
  it('duplicate verification should result in msg.unknownVerificationToken()', function(done){
    var token1 = {token: verificationToken};
    client.query('subscriber/verify', 'POST', {}, token1, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.unknownVerificationToken().message);
        done();
      }
    });
  });

  /**
  * 3. Subscriber trying to verify without a token field should return error
  */
  it('missing token field should result in msg.missingToken()', function(done){
    client.query('subscriber/verify', 'POST', {}, {}, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.missingToken().message);
        done();
      }
    });
  });

});
var accesstoken;
describe('/login', function(){

  it('successful login should present x-access-token', function(done){
    var login = {email: testEmail, password: 'testpass'};
    client.query('subscriber/login', 'POST', {}, login, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert(body.value['x-access-token']);
        accessToken = body.value['x-access-token'];
        done();
      }
    });
  });

  it('with invalid credentials should return msg.invalidPassword', function(done){
    var login2 = {email: testEmail, password: 'test22pass'};
    client.query('subscriber/login', 'POST', {}, login2, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.invalidPassword().message);
        done();
      }
    });
  });

  it('with missing email should return msg.missingEmail()', function(done){
    var login3 = { password: 'test22pass'};
    client.query('subscriber/login', 'POST', {}, login3, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.missingEmail().message);
        done();
      }
    });
  });

  it('with missing password should return msg.missingEmail()', function(done){
    var login3 = {email: testEmail};
    client.query('subscriber/login', 'POST', {}, login3, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.missingPassword().message);
        done();
      }
    });
  });

});

describe('/login', function(){

  before(function(done){
    var resetToken = uuid.v4();
    store.resetSubscriber(testEmail, resetToken, function(err, result){
      if(err){
        console.log(err);
      } else {
        done();
      }
    });
  });

  it('should return error when subscriber in RESET state', function(done){
    var login = {email: testEmail, password: 'testpass'};
    client.query('subscriber/login', 'POST', {}, login, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.subscriberReset().message);
        done();
      }
    });
  });

});

describe('/reset', function(){
var passResetToken;

  before(function(done){
    store.getSubscriberByEmail(testEmail,  function(err, result){
      if(err){
        console.log(err);
      } else {
        passResetToken = result.verification_token;
        done();
      }
    });
  });

  it('should return msg.success() on password reset', function(done){
    var resetBody = {token:passResetToken, password: 'testpass2'};
    client.query('subscriber/reset', 'POST', {}, resetBody, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert(body.value);
        done();
      }
    });
  });

});

describe('/update', function(){
  
  it('should return error when no old password is present', function(done){
    var update = {oldPassword: '', newPassword: 'newpassword'};
    client.query('subscriber/update', 'POST', {}, update, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.missingPassword().message);
        done();
      }
    });
  });
  
  it('should return error when old password is malformed', function(done){
    var update = {oldPassword: 'mal', newPassword: 'newpassword'};
    client.query('subscriber/update', 'POST', {}, update, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.malformedPassword().message);
        done();
      }
    });
  });
  
  it('should return error when no new password is present', function(done){
    var update = {oldPassword: 'testpass', newPassword: ''};
    client.query('subscriber/update', 'POST', {}, update, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.missingNewPassword().message);
        done();
      }
    });
  });
  
  it('should return error when new password is malformed', function(done){
    var update = {oldPassword: 'testpass', newPassword: 'mal'};
    client.query('subscriber/update', 'POST', {}, update, function(err, res, body){
      if(err){
        console.log(err);
      } else {
        assert.equal(body.error.message, msg.malformedNewPassword().message);
        done();
      }
    });
  });
  
});

});
