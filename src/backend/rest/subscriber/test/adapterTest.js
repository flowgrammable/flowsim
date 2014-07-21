// put adapter test stuff here
var adapter = require('./testAdapter.js');
var assert = require('assert');

var testEmail ='test@gmail.com';
var subscriber;
// ----------------------------------------------------------------------------
// Testing insertSubscriber

describe('===> Testing insertSubscriber adapter function:\n', function() {
  it('User registered successfully', function(done) {
    adapter.insertSubscriber(testEmail, 'My Password', '127.0.0.1', function (result) {
      assert(result.value, "User not registered successfully")
      done();
    });
  });
  it('Email in Use', function(done) {
    adapter.insertSubscriber(testEmail,'My Password', '127.0.0.1', function (result) {
      assert.equal(result.error.type, "emailInUse")
      done();
    });
  });
});
var config = true;

// ----------------------------------------------------------------------------
// Testing fetchSubscriber

describe('===> Testing fetchSubscriber adapter function:\n', function() {
  it('User fetched successfully', function(done) {
    adapter.fetchSubscriber({email: testEmail}, function (result) {
      assert(result.value, "Unable to fetch user")
      subscriber = result.value;
      done();
    });
  });
  it('Subscriber not found', function(done) {
    adapter.fetchSubscriber({email: "something@gmail.com"}, function (result) {
      assert.equal(result.error.type, "subscriberNotFound")
      done();
    });
  });
});

// ----------------------------------------------------------------------------
// Testing verifySubscriber

describe('===> Testing verifySubscriber adapter function:\n', function() {
  it('User verified successfully', function(done) {
    adapter.verifySubscriber(subscriber, function (result) {
      assert(result.value, "Unable to verify user")
      done();
    });
  });
  it('Subscriber Already verified', function(done) {
    adapter.verifySubscriber(subscriber, function (result) {
      assert.equal(result.error.type, "subscriberAlreadyVerified")
      done();
    });
  });
});

// ----------------------------------------------------------------------------
// Testing sendVerificationEmail

describe('===> Testing sendVerificationEmail adapter function: \n', function(){
	it('Mail sent successfully', function(done){
		adapter.sendVerificationEmail(testEmail, config, function(result) {
			assert(result.value, "could not sent mail")
			done();
		});
	});
	it('Bad configuration', function(done){
		config = false;
		adapter.sendVerificationEmail(testEmail, config, function(result) {
			assert.equal(result.error.type, "badEmailConfiguration")
			done();
		});
	});
});

// ----------------------------------------------------------------------------
// Testing verifyRedirect

describe('===> Testing verifyRedirect adapter function: \n', function(){
  var tunnel = {code: 302, 
			headers: {'Location':'http://localhost:3000/verified.html'}};

	it('Should create redirect', function(done){
		adapter.verifyRedirect(function(result){
			assert.equal(JSON.stringify(result.tunnel), JSON.stringify(tunnel));
			done();
		});
  }); 
});

// ----------------------------------------------------------------------------
// Testing createSession

describe('===> Testing createSession adapter function:\n', function() {
  it('Session created successfully', function(done) {
    adapter.createSession(subscriber.id, function (result) {
      assert(result.value, "Unable to create session")
      done();
    });
  });
});