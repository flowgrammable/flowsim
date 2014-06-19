var request = require('request');
var assert = require('assert');

var testEmail = 'ash.1382@gmail.com';
describe('Testing client login:',function() {
  it('Token gen successfully',function(done) {
    request( {
      url: 'http://localhost:8000/login',
      body: '{ \"email\": \"'+testEmail+'\", \"password\":\"my password\" }',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }, function (error, response, body) {
      console.log('\n\tStatus : '+ response.statusCode);
      assert.equal(response.statusCode,200);
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('User with this email does not exists',function(done) {
    request( {
      url: 'http://localhost:8000/login',
      body: '{ \"email\": \"Invalid@email.com\", \"password\":\"my password\" }',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }, function (error, response, body) {
      console.log('\n\tStatus : '+ response.statusCode);
      assert.equal(response.statusCode,401);
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('Password mismatch',function(done) {
    request( {
      url: 'http://localhost:8000/login',
      body: '{ \"email\": \"'+testEmail+'\", \"password\":\"my password123\" }',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }, function (error, response, body) {
      console.log('\n\tStatus : '+ response.statusCode);
      assert.equal(response.statusCode,401);
      console.log('\tResponse received : ', body);
      done();
    });
  });
  it('Password mismatch',function(done) {
    request( {
      url: 'http://localhost:8000/login',
      body: '{ \"email\": \"coltonchojnacki@gmail.com\", \"password\":\"my password\" }',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }, function (error, response, body) {
      console.log('\n\tStatus : '+ response.statusCode);
      assert.equal(response.statusCode,401);
      console.log('\tResponse received : ', body);
      done();
    });
  });
});
