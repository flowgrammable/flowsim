var request = require('request');
var assert = require('assert');

describe('Testing client login:',function() {
  it('Token gen successfully',function(done) {
    request( {
      url: 'http://localhost:8000/subscribers/login',
      body: '{ \"email\": \"user3@user3.com\", \"password\":\"my password\" }',
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
});
