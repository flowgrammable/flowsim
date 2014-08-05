var orm = require('../../../dbbs');
var Profile = orm.model("switch_profile");
var request = require('request');
var assert = require('assert');
var fs = require('fs');

orm.setup()
var token, sessKey;

// ----------------------------------------------------------------------------
// Testing registration
describe('Registering, verifying, and logging in an account:',function() {
  it('User registered successfully',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/register',
      body: '{ \"email\": \"test@gmail.com\", \"password\": \"my password\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert(JSON.parse(body)['value'],'Unable to register user');
      console.log('\tResponse received : ', body);
      fs.exists(process.cwd()+'/temp', function (exists) {
        if(exists) {
          fs.readFile(process.cwd()+'/temp','utf8',function (err,data) {
            if (err) console.log('Unable to read token in file for restTest');
            else {
              var array = data.toString().split("\n"); 
              token = JSON.parse(array[0]).ver_token;
              done();
            }
          });
        }
      });
    }); 
  });
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
  it('Subscriber logged in successfully',function(done) {
    request( {
      url: 'http://localhost:3000/api/subscriber/login',
      body: '{ \"email\": \"test@gmail.com\", \"password\": \"my password\"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert(JSON.parse(body)['value'],'Unable to login user');
      console.log('\tResponse received : ', body);
      sessKey = JSON.parse(body)['value'];
      done();
    });
  });
});

// ----------------------------------------------------------------------------
// Testing create profile
describe('Testing create profile requests:',function() {
  it('A request that is successful should return msg.success()',
  function(done) {
    request( {
      url: 'http://localhost:3000/api/profile/create',
      body: '{ \"name\": \"test profile\"}',
      headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
      method: 'POST'
    }, function (error, response, body) {
      assert(JSON.parse(body)['value'],'Unable to create profile');
      console.log('\tResponse received : ', body);
      done();
    }); 
  });
  it('A request with a name that already exists should return msg.nameInUse()',
  function(done) {
    request( {
      url: 'http://localhost:3000/api/profile/create',
      body: '{ \"name\": \"test profile\"}',
      headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'nameInUse');
      console.log('\tResponse received : ', body);
      done();
    }); 
  });
  it('A request with a missing name should return msg.missingName()',
  function(done) {
    request( {
      url: 'http://localhost:3000/api/profile/create',
      body: '{ \"name\": \"\"}',
      headers: { 'Content-Type':'application/json', 'x-access-token': sessKey },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'missingName');
      console.log('\tResponse received : ', body);
      done();
    }); 
  });
});

