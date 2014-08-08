var orm = require('../../../dbbs');
var request = require('request');
var assert = require('assert');

orm.setup()

var testEmail = 'flowgrammablemailer@gmail.com';

// ----------------------------------------------------------------------------
// Testing packet creation
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
      fs.readFile(process.cwd()+'/temp','utf8',function (err,data) {
        if (err) console.log('Unable to read token in file for restTest');
        else {
          var array = data.toString().split("\n");
          token = JSON.parse(array[0]).ver_token;
        }
      });
      console.log('\tResponse received : ', body);
      done();
    });
  });
});


describe('Testing packet creation request:',function() {
  it('Packet created successfully',function(done) {
    request( {
      url: 'http://localhost:3000/api/packet/create',
      body: '{ \"name\": \"Packet66\"}',
      headers: { 
        'Content-Type': 'application/json',
        'x-access-token': session
      },
      method: 'POST'
    }, function (error, response, body) {
      assert(JSON.parse(body)['value'],'Unable to create packet');
      console.log('\tResponse received : ', body);
      done();
    });
  });
});
