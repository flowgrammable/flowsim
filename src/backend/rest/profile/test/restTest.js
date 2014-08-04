var orm = require('../../../dbbs');
var Profile = orm.model("switch_profile");
var request = require('request');
var assert = require('assert');

orm.setup()

// ----------------------------------------------------------------------------
// Testing create profile
describe('Testing create profile requests:',function() {
  it('A request that is successful should return msg.success()',
  function(done) {
    request( {
      url: 'http://localhost:3000/api/profile/create',
      body: '{ \"name\": \"test profile\"}',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    }, function (error, response, body) {
      assert.equal(JSON.parse(body)['error']['type'],'missingName');
      console.log('\tResponse received : ', body);
      done();
    }); 
  });
});

