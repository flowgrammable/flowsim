var orm = require('../../../dbbs');
orm.setup();
var Subscriber = orm.model("subscriber");
var assert = require('assert');
var adapter = require('../adapter');

var testEmail ='ash.1382@gmail.com';
var subscriber;
describe('===> Testing insertSubscriber adapter function:\n',function() {
  it('User registered successfully',function(done) {
    adapter.insertSubscriber(testEmail,'My Password',function (result) {
      assert(result.value,"User not registered successfully")
      subscriber = result.value;
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

describe('===> Testing fetchSubscriber adapter function:\n',function() {
  it('User fetched successfully',function(done) {
    adapter.fetchSubscriber({email:testEmail},function (result) {
      assert(result.value,"Unable to fetch user")
      done();
    });
  });
  it('Subscriber not found',function(done) {
    adapter.fetchSubscriber({email:"SOmething@gmail.com"},function (result) {
      assert.equal(result.error.type,"subscriberNotFound")
      done();
    });
  });
});

describe('===> Testing verifySubscriber adapter function:\n',function() {
  it('User verified successfully',function(done) {
    adapter.verifySubscriber(subscriber,function (result) {
      assert(result.value,"Unable to verify user")
      done();
    });
  });
  it('Subscriber Already verified',function(done) {
    adapter.verifySubscriber(subscriber,function (result) {
      assert.equal(result.error.type,"subscriberAlreadyVerified")
      done();
    });
  });
});

describe('===> Testing sendVerificationEmail adapter function:\n',function() {
  it('Verification Email sent successfully',function(done) {
    adapter.sendVerificationEmail(subscriber,function (result) {
      assert(result.value,"Unable to verify user")
      done();
    });
  });
});

describe('===> Testing generateAuthToken adapter function:\n',function() {
  it('AuthToken generated successfully',function(done) {
    adapter.generateAuthToken(subscriber,function (result) {
      assert(result.value,"Unable to generate authToken")
      done();
    });
  });
});

describe('===> Testing authenticateSubscriber adapter function:\n',function() {
  it('Subscriber authenticated successfully',function(done) {
    adapter.authenticateSubscriber('My Password',subscriber,function (result) {
      assert(result.value,"Unable to authenticate subscriber")
      done();
    });
  });
  it('Incorrect Password',function(done) {
    adapter.authenticateSubscriber('NOt Password',subscriber,function (result) {
      assert.equal(result.error.type,"incorrectPwd")
      done();
    });
  });
});

