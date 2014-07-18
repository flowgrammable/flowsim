var subModel = require('../model.js');
var testAdapter = require('./testAdapter.js');
var assert = require('assert');
var model = subModel(testAdapter);
var msg = require('../msg.js');

//------------------------------------------------------------------------------
// Registration Tests
describe('===> Testing createSubscriber: \n',function() {
  it('User registered successfully',function(done) {
  	model.subscriber.create('test@test.com', 'mypassword', '127.0.0.1', 
			function(result){
  		assert(result.value, "Could not create subscriber");
		done();
	});
  });
    it('Duplicate subscriber',function(done) {
  	model.subscriber.create('test@test.com', 'mypassword', '127.0.0.1', 
			function(result){
  		assert.equal(result.error.type, "emailInUse");
		done();
	});
  });
});


//------------------------------------------------------------------------------
// Verification Tests
describe('===> Testing subVerify: \n',function() {
  var token = '';
  var expectedResult =
  { value: {},
    tunnel: {code: 302,
             headers: {'Location':'http://localhost:3000/verified.html'}}};
  // setup subscriber
  before(function(){
    testAdapter.insertSubscriber('verify@test.com', '1234password', '127.0.0.1', 
			function(result){
    token = result.value.verification_token;
   });
  });
  it('Subscriber verified ',function(done) {
  	model.subscriber.verify(token, function(result){
  	  assert.equal(JSON.stringify(result), JSON.stringify(expectedResult));
			done();
		});
  });

  it('Subscriber already verified ',function(done) {
  	model.subscriber.verify(token, function(result){
  	  assert.equal(JSON.stringify(result), 
				JSON.stringify(msg.subscriberAlreadyVerified()));
			done();
		});
  });
});

//------------------------------------------------------------------------------
// Authenticate Tests
describe('===> Testing sessionAuthenticate: \n', function(){
	before(function(){
	//insert a verified user into db
  var testPassword = 'testPassword';
  var encrypted = bcrypt.hashSync(testPassword, 10);
  var testSubscriber = {email: 'testSubscriber@test.com', 
			password: encrypted, 
			reg_date: new Date(),
			reg_ip: '127.0.0.1',
      verification_token: 'doesntmatter',
      status: 'VERIFIED'
			};
  testAdapter.makeSubscriber(testSubscriber, function(result){
  
	});
  });
});
