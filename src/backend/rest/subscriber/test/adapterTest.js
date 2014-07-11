var orm = require('../../../dbbs');
orm.setup();
var Subscriber = orm.model("subscriber");
var assert = require('assert');
var adapter = require('../adapter');

var testEmail ='asssh.1382@gmail.com';

describe('Testing adapter functions:',function() {
  it('User registered successfully',function(done) {
    adapter.insertSubscriber(testEmail,'My Password',function (result) {
      assert(result.value,"User not registered successfully")
      done();
    });
  });
  it('Email in Use',function(done) {
    adapter.insertSubscriber(testEmail,'My Password',function (result) {
      assert.equal(result.error.type,"emailInUse")
      done();
    });
  });
});
