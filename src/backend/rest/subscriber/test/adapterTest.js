// put adapter test stuff here
var adapter = require('./testAdapter.js');
var assert = require('assert');

var testEmail ='test@gmail.com';

// ----------------------------------------------------------------------------
// Testing insert subscriber

describe('===> Testing insertSubscriber adapter function:\n',function() {
  it('User registered successfully',function(done) {
    adapter.insertSubscriber(testEmail,'My Password','127.0.0.1',function (result) {
      assert(result.value,"User not registered successfully")
      subscriber = result.value;
      done();
    });
  });
  it('Email in Use',function(done) {
    adapter.insertSubscriber(testEmail,'My Password','127.0.0.1',function (result) {
      assert.equal(result.error.type,"emailInUse")
      done();
    });
  });
});
