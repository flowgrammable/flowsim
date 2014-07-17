var subModel = require('../model.js');
var testAdapter = require('./testAdapter.js');
var assert = require('assert');
var model = subModel(testAdapter);


describe('===> Testing createSubscriber: \n',function() {
  it('User registered successfully',function(done) {
  	model.subscriber.create('test@test.com', 'mypassword', '127.0.0.1', function(result){
  		assert(result.value, "Could not create subscriber");
		done();
	});
  });
});


