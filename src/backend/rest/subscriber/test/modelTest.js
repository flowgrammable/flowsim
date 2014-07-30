var bcrypt = require('bcrypt');

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
  // setup subscriber
  before(function(){
    testAdapter.insertSubscriber('verify@test.com', '1234password', '127.0.0.1', 
			function(result){
    token = result.value.verification_token;
   });
  });
  it('Subscriber verified ',function(done) {
  	model.subscriber.verify(token, function(result){
  	  assert.equal(JSON.stringify(result), 
      "{\"value\":{},\"tunnel\":{\"code\":302,\"headers\":{\"Location\":"+
      "\"http://localhost:3000/verified.html\"}}}");
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
	
  var testPassword = 'testPassword';
  var encrypted = bcrypt.hashSync(testPassword, 10);
  var testSubscriber = {email: 'testSubscriber@test.com', 
			password: encrypted, 
			reg_date: new Date(),
			reg_ip: '127.0.0.1',
      verification_token: 'doesntmatter',
      status: 'ACTIVE'
			};
	before(function(){
	//insert a verified user into db
  testAdapter.makeSubscriber(testSubscriber);
  });
	it('Subscriber should authenticate: \n', function(done){
		model.session.authenticate(testSubscriber.email, testPassword, 
			function(result){
			assert(result.value, true);
			done();
		});
	});
});

describe('===> Testing sessionAuthenticate: \n', function(){
	
  var testPassword = 'testPassword';
  var encrypted = bcrypt.hashSync(testPassword, 10);
  var testSubscriber2 = {email: 'testSubscriber2@test.com', 
			password: encrypted, 
			reg_date: new Date(),
			reg_ip: '127.0.0.1',
      verification_token: 'doesntmatter',
      status: 'REGISTERED'
			};
	before(function(){
	//insert a verified user into db
  testAdapter.makeSubscriber(testSubscriber2);
  });
	it('Subscriber in REGISTERED state should  not authenticate: \n', function(done){
		model.session.authenticate(testSubscriber2.email, testPassword, 
			function(result){
			assert.equal(JSON.stringify(result), 
				JSON.stringify(msg.subscriberNotActive()));
			done();
		});
	});
});


describe('===> Testing sessionAuthenticate: \n', function(){
	
  var testPassword = 'testPassword';
  var encrypted = bcrypt.hashSync(testPassword, 10);
  var testSubscriber3 = {email: 'testSubscriber3@test.com', 
			password: encrypted, 
			reg_date: new Date(),
			reg_ip: '127.0.0.1',
      verification_token: 'doesntmatter',
      status: 'ACTIVE'
			};
	before(function(){
	//insert a verified user into db
  testAdapter.makeSubscriber(testSubscriber3);
  });
	it('Invalid password should return msg.incorrectPwd(): \n', function(done){
		model.session.authenticate(testSubscriber3.email, 'badpass', 
			function(result){
			assert.equal(JSON.stringify(result), 
				JSON.stringify(msg.incorrectPwd()));
			done();
		});
	});
});

//------------------------------------------------------------------------------
// Reset Password 
describe('===> Testing forgotRequest: \n', function(){
	var testSubscriber4 = {
		email: 'testSubscriber4@test.com',
		password: 'doesnt matter',
		reg_date: new Date(),
		reg_ip: '127.0.0.1',
		verification_token: 'doesnt matter',
		status: 'ACTIVE'
		};
	before(function(){
		testAdapter.makeSubscriber(testSubscriber4);
	});
  it('forgotRequest(email) should return msg.success() if subsciber exists and is not CLOSED : \n', 
    function(done){
  		model.subscriber.forgotRequest(testSubscriber4.email, function(result){
  			assert.equal(JSON.stringify(result), JSON.stringify(msg.success()));
  			done();
  		});	
    }
  );
  it('forgotRequest(email) should return msg.subscriberNotFound() if subscriber is not found : \n', 
    function(done){
      model.subscriber.forgotRequest('doesnotexist@gmail.com', function(result){
        assert.equal(JSON.stringify(result), JSON.stringify(msg.subscriberNotFound()));
        done();
      }); 
    }
  );
  it('forgotRequest(email) should return msg.subscriberClosed() if subsciber status is CLOSED : \n', 
    function(done){
      testAdapter.updateSubscriber(testSubscriber4, {status: 'CLOSED'}, function(result){});
      model.subscriber.forgotRequest(testSubscriber4.email, function(result){
        assert.equal(JSON.stringify(result), JSON.stringify(msg.subscriberClosed()));
        done();
      }); 
    }
  );
});


describe('===> Testing passwordUpdate: \n', function(){
  var testSubscriber5 = {
    email: 'testSubscriber5@test.com',
    password: 'doesnt matter',
    reg_date: new Date(),
    reg_ip: '127.0.0.1',
    verification_token: 'doesnt matter',
    status: 'RESET',
    reset_token: 'c2e6de55-2030-41e0-aa48-6ce5d2312a67'
  };
  var activeSubscriber = {
    email: 'closedSub@test.com',
    password: 'pwd',
    reg_date: new Date(),
    reg_ip: '127.0.0.1',
    verification_token: 'none',
    status: 'ACTIVE',
    reset_token: 'c2e6re55-2130-41e0-aa47-6ce5d2312a67'
  };
  before(function(){
    testAdapter.makeSubscriber(testSubscriber5);
    testAdapter.makeSubscriber(activeSubscriber);
  });
  it('passwordUpdate(token,password) should return msg.success() '+
    'if subscriber exists and has RESET status : \n', 
    function(done){
      model.subscriber.passwordUpdate(testSubscriber5.reset_token, "pwd",
       function(result){
        assert(result.value, "Could not update password");
        done();
       }
      ); 
    }
  );
  it('passwordUpdate(token,password) should return msg.subscriberNotFound()'+
     ' if subscriber is not found : \n', 
    function(done){
      model.subscriber.passwordUpdate('c2e6de55-2030-41e0-aa48-6ce5d2312a68', "pwd",
       function(result){
        assert.equal(JSON.stringify(result), JSON.stringify(msg.subscriberNotFound()));
        done();
       }
      ); 
    }
  );
  it('passwordUpdate(token,password) should return msg.subscriberNotReset()'+
     ' if subsciber status is not RESET : \n', 
    function(done){
      model.subscriber.passwordUpdate(activeSubscriber.reset_token, "pwd", 
       function(result){
        assert.equal(JSON.stringify(result), JSON.stringify(msg.subscriberNotReset()));
        done();
       }
      ); 
    }
  );
});

//------------------------------------------------------------------------------
// Edit Password
describe('===> Testing editPasswd: \n', function(){
  var encrypted =  bcrypt.hashSync('somePasswd123', 10);
  var testSubscriber = {email: 'testEditPwd@test.com',
      password: encrypted,
      reg_date: new Date(),
      reg_ip: '127.0.0.1',
      verification_token: 'doesntmatter',
      status: 'ACTIVE'
      };
  before(function(){
   testAdapter.makeSubscriber(testSubscriber);
   model.session.authenticate(testSubscriber.email, 'somePasswd123', function(result){
    testAdapter.fetchSession(result.value, function(res) {
      session = res.value;
    });
   });
  });
  it('editPassword should return msg.success() if subsciber inputs a matching oldpwd and a valid newpwd : \n', function(done){
    model.subscriber.editPasswd(session, 'somePasswd123', 'this123matters', function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.success()));
      done();
    });

  });

  it('editPassword should return msg.incorrectPwd() when trying' +
      'to give invalid current password : \n', function(done){
    model.subscriber.editPasswd(session, 'blahblahblah', 'something_good', function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.incorrectPwd()));
      done();
    });

  });
});

