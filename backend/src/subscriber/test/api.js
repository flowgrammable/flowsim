var mocha = require('mocha');
var assert = require('assert');
var uuid = require('node-uuid');

var client = require('../../client');
var testUtils = require('../../test/utils');
var msg = require('../msg');
var st = require('./../storage');
var pg = require('../../database/pg');


var db = new pg.Database({database:{
  user: 'flogdev',
  pwd: 'flogdev',
  host: 'localhost',
  database: 'flowsim'
}});

var store = new st.Storage(db);

var testEmail = 'coltonchojnacki@gmail.com';

var url = 'https://127.0.0.1:8081/api/';

describe('/api/subscriber', function(){
  // Delete all subscribers, sessions, and packets from db before running tests
  before(function(done){
    testUtils.clearTables(['packet', 'session', 'subscriber'],
      function(err, result){
        if(err){
          console.log(err);
        } else {
          done();
        }
      });
  });

describe('/register', function(){

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

describe('Logging in with a subscriber in CREATED state', function(){

  before(function(done){
    testUtils.clearTables(['packet', 'session', 'subscriber'],
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

describe('/verify', function(){
var verificationToken;
  before(function(done){
    store.getSubscriberByEmail(testEmail, function(err, result){
      if(err){
        console.log(err);
      } else {
        verificationToken = result.verification_token;
        done();
      }
    })
  });

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
        assert.equal(body.error.message, msg.subscriberReset().message)
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

});
