var request = require('request');
var assert = require('assert');

var testEmail = 'ash.1382@gmail.com';
describe('Testing client requests:',function() {
  it('User registered successfully',function(done) {
    request( {
      url: 'http://localhost:8000/api/subscribers',
      body: '{ \"email\": \"'+testEmail+'\", \"password1\": \"my password\"' +
      ', \"password2\":\"my password\" }',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }, function (error, response, body) {
      console.log('\n\tStatus : '+ response.statusCode);
      assert.equal(response.statusCode,201);
      console.log('\tResponse received : ', body);
      done();
    });
  });

  it('Invalid e-mail address',function(done) {
    request({
      url: 'http://localhost:8000/api/subscribers',
      body: '{ \"email\": \"Invalid@emailAddresssCom\", \"password1\":' +
      ' \"my password\", \"password2\":\"my password\" }',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }, function (error, response, body) {
      console.log('\n\tStatus : '+ response.statusCode);
      assert.equal(response.statusCode,400);
      console.log('\tResponse received : ', body);
      done();
    });
  });

  it('Password is not in the range of 8-16',function(done) {
    request({
      url: 'http://localhost:8000/api/subscribers',
      body: '{ \"email\": \"'+testEmail+'\", \"password1\":' +
      ' \"my\", \"password2\":\"my\" }',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }, function (error, response, body) {
      console.log('\n\tStatus : '+ response.statusCode);
      assert.equal(response.statusCode,400);
      console.log('\tResponse received : ', body);
      done();
    });
  });
  
  it('Password Mismatch',function(done) {
    request({
      url: 'http://localhost:8000/api/subscribers',
      body: '{ \"email\": \"'+testEmail+'\", \"password1\":' +
      ' \"my password\", \"password2\":\"my password12\" }',
      headers: {
        "Content-Type": "application/json"
      },
      method: 'POST'
    }, function (error, response, body) {
      console.log('\n\tStatus : '+ response.statusCode);
      assert.equal(response.statusCode,400);
      console.log('\tResponse received : ', body);
      done();
    });
  });
  
  it('E-mail Address is already registered',function(done) {
    request({
      url: 'http://localhost:8000/api/subscribers',
      body: '{ \"email\": \"'+testEmail+'\", \"password1\":' +
      ' \"my password\", \"password2\":\"my password\" }',
      headers: {
        "Content-Type": "application/json"
      },
      method: 'POST'
    }, function (error, response, body) {
      console.log('\n\tStatus : '+ response.statusCode);
      assert.equal(response.statusCode,409);
      console.log('\tResponse received : ', body);
      done();
    });
  });
   
  it('Invalid token',function(done) {
    request({
      url: 'http://localhost:8000/api/subscribers/verify/110ec58a-a0f2-4ac4-8393-c866d8138d',
      method: 'GET'
    }, function (error, response, body) {
      console.log('\n\tStatus : '+ response.statusCode);
      assert.equal(response.statusCode,404);
      console.log('\tResponse received : ', body);
      done();
    });
  });
});
