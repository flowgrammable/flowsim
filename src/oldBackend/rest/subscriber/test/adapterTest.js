// put adapter test stuff here
var adapter = require('./testAdapter.js');
var assert = require('assert');

var testEmail ='test@gmail.com';
var subscriber, session, sessKey;
// ----------------------------------------------------------------------------
// Testing insertSubscriber
describe('Adapter Tests:\n', function() {
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

describe('===> Testing updateSubscriber adapter function:\n', function() {
  it("User status updated to 'ACTIVE' successfully", function(done) {
    adapter.updateSubscriber(subscriber, { status: 'ACTIVE' }, function (result) {
      assert(result.value, "Unable to verify user")
      done();
    });
  });
});

// ----------------------------------------------------------------------------
// Testing sendVerificationEmail

describe('===> Testing sendVerificationEmail adapter function: \n', function(){
	it('Verification email sent successfully', function(done){
		adapter.sendVerificationEmail(testEmail, function(result) {
			assert(result.value, "could not sent mail")
			done();
		});
	});
});

// ----------------------------------------------------------------------------
// Testing sendResetEmail

describe('===> Testing sendResetEmail adapter function: \n', function(){
  it('Reset email sent successfully', function(done){
    adapter.sendVerificationEmail(testEmail, function(result) {
      assert(result.value, "could not sent mail")
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
//
// Note: This contains no negative testing since we are unable to
// anticipate any errors that may be caused by this function.

describe('===> Testing createSession adapter function:\n', function() {
  it('Session created successfully', function(done) {
    adapter.createSession(subscriber.id, function (result) {
      assert(result.value, "Unable to create session")
      sessKey = result.value;
      done();
    });
  });
});

// ----------------------------------------------------------------------------
// Testing fetchSession

describe('===> Testing fetchSession adapter function:\n', function() {
  it('Session fetched successfully', function(done) {
    adapter.fetchSession(sessKey, function (result) {
      assert(result.value, "Unable to fetch session")
      session = result.value;
      done();
    });
  });
  it('Session not found', function(done) {
    adapter.fetchSession("Nonexistent session key", function (result) {
      assert.equal(result.error.type, "sessionNotFound")
      done();
    });
  });
});

// ----------------------------------------------------------------------------
// Testing destroySession
//
// Note: This contains no negative testing since we are unable to
// anticipate any errors that may be caused by this function.

describe('===> Testing destroySession adapter function:\n', function() {
  it('Session destroyed successfully', function(done) {
    adapter.destroySession(session, function (result) {
      assert(result.value, "Unable to destroy session")
      done();
    });
  });
});
});

