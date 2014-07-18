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
    it('Duplicate subscriber',function(done) {
  	model.subscriber.create('test@test.com', 'mypassword', '127.0.0.1', function(result){
  		assert.equal(result.error.type, "emailInUse");
		done();
	});
  });
});

describe('===> Testing subVerify: \n',function() {
  // setup subscriber
  before(function(){
  	var token;
    testAdapter.insertSubscriber('verify@test.com', '1234password', '127.0.0.1', function(result){
    	token = result.verification_token;
    });
  })
  it('Subscriber verified ',function(done) {
  	model.subscriber.verify(token, function(result){
  		//TODO: verify redirection url is returned
  	});
  });
});