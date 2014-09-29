var assert = require('assert');

var msg = require('../msg.js');
var subController = require('../controller.js');
var testAdapter = require('./testAdapter.js');
var events = require('../../../events.js');

var controller = subController(testAdapter);

//-----------------------------------------------------------------------------
// Registration Controller Tests
describe('Controller Tests:\n', function() {
describe('===> Testing Register subscriber controller: \n', function(){


  it('Test if email not provided', function(done){
		var testId = 'testerID1';
    var data = {email: '', password: 'tester'};

		events.Emitter.once(testId, function(result){
		assert.equal(JSON.stringify(result), JSON.stringify(msg.missingEmail()));
		done();
		});
  controller.module.noauth.register('POST', {}, data, '127.0.0.1', testId);
	});

  it('Test if email provided is invalid', function(done){
		var testId = 'testerID2';
    var data = {email: 'a_terrible_email', password: 'tester'};

		events.Emitter.once(testId, function(result){
		assert.equal(JSON.stringify(result), 
								 JSON.stringify(msg.badEmail(data.email)));
		done();
		});
  controller.module.noauth.register('POST', {}, data, '127.0.0.1', testId);
	});


  it('Test if password not provided', function(done){
		var testId = 'testerID3';
    var data = {email: 'test@hello.com', password: ''};

		events.Emitter.once(testId, function(result){
		assert.equal(JSON.stringify(result), 
								 JSON.stringify(msg.missingPwd()));
		done();
		});
  controller.module.noauth.register('POST', {}, data, '127.0.0.1', testId);
	});


  it('Test if password provided is invalid', function(done){
		var testId = 'testerID4';
    var data = {email: 'test@hello.com', password: '2short'};

		events.Emitter.once(testId, function(result){
		assert.equal(JSON.stringify(result), 
								 JSON.stringify(msg.badPwd()));
		done();
		});
  controller.module.noauth.register('POST', {}, data, '127.0.0.1', testId);
	});
  

  it('Test if method is not POST', function(done){
    var testId = 'testerID4';
    var data = {email: 'test@hello.com', password: '2short'};

    events.Emitter.once(testId, function(result){
    assert.equal(JSON.stringify(result),
                 JSON.stringify(msg.methodNotSupported()));
    done();
    });
  controller.module.noauth.register('GET', {}, data, '127.0.0.1', testId);
  });
});

// ----------------------------------------------------------------------------
// Verification Test
describe('===> Testing Verify subscriber controller: \n', function(){
	
	it('Test if token provided invalid', function(done){
		var testId = 'testerID1';
	  var data = {token: 'aninvalid token'};
		var params = [];
	
		events.Emitter.once(testId, function(result){
		assert.equal(JSON.stringify(result),
		JSON.stringify(msg.badVerificationToken()))
		done();
		});
	  controller.module.noauth.verify('POST', params, data, '127.0.0.1', testId);
	});
	
	it('Test if token not provided', function(done){
		var testId = 'testerID2';
	    	var data = {};
	    	var params = ['doesnt_matter_only_looking_for_params1', ''];
		events.Emitter.once(testId, function(result){
		assert.equal(JSON.stringify(result),
		JSON.stringify(msg.missingVerificationToken()));
		done();
		});
	  controller.module.noauth.verify('POST', params, data, '127.0.0.1', testId);
	});

  it('Test if method is not POST', function(done){
    var testId = 'testerID2';
        var data = {};
        var params = ['doesnt_matter_only_looking_for_params1', ''];
    events.Emitter.once(testId, function(result){
    assert.equal(JSON.stringify(result),
    JSON.stringify(msg.methodNotSupported()));
    done();
    });
    controller.module.noauth.verify('GET', params, data, '127.0.0.1', testId);
  });
});

// --------------------------------------------------------------------------------
// Login Test
describe('===> Testing Login subscriber controller: \n', function(){

	it('Test if email not provided', function(done){
    var testId = 'testerID1';
 		var data = {email: '', password: 'tester'};
    events.Emitter.once(testId, function(result){
   		assert.equal(JSON.stringify(result), JSON.stringify(msg.missingEmail()));
   		done();
    });
 	  controller.module.noauth.login('POST', {}, data, '127.0.0.1', testId);
  });

 	it('Test if email provided invalid', function(done){
    var testId = 'testerID2';
 		var data = {email: 'a_terrible_email', password: 'tester'};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.badEmail(data.email)));
      done();
    });
 	  controller.module.noauth.login('POST', {}, data, '127.0.0.1', testId);
  });
	it('Test if password not provided',function(done){
		var testId = 'testerID3';
		var data = {email: 'test@hello.com', password: '' };
		events.Emitter.once(testId, function(result){
                	assert.equal(JSON.stringify(result), JSON.stringify(msg.missingPwd()));
                	done();
   	 	});
        controller.module.noauth.login('POST', {}, data, '127.0.0.1', testId);

	});

        it('Test if password provided invalid',function(done){
                var testId = 'testerID4';
                var data = {email: 'test@hello.com', password: 'badPass' };
                events.Emitter.once(testId, function(result){
                        assert.equal(JSON.stringify(result), JSON.stringify(msg.badPwd()));
                        done();
                });
        controller.module.noauth.login('POST', {}, data, '127.0.0.1', testId);

        });

	
  it('Test if method is not POST', function(done){
    var testId = 'testerID5';
    var data = {email: 'a_terrible_email', password: 'tester'};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.methodNotSupported()));
      done();
    });
    controller.module.noauth.login('GET', {}, data, '127.0.0.1', testId);
  });
});

// ----------------------------------------------------------------------------
// Forgot password phase one
describe('===> Testing Forgot Password subscriber controller: \n', function(){
	it('If an email is not provided, a msg.missingEmail() should be returned', function(done){
  	var testId = 'testerID1';
 		var data = {email: ''};
    events.Emitter.once(testId, function(result){
	    assert.equal(JSON.stringify(result), JSON.stringify(msg.missingEmail()));
	    done();
    });
 	  controller.module.noauth.forgotpassword('POST', {}, data, '127.0.0.1', testId);
  });
 	it('If the email provided is invalid, a msg.badEmail() should be returned', function(done){
    var testId = 'testerID2';
   	var data = {email: 'a_terrible_email'};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.badEmail(data.email)));
      done();
    });
 	  controller.module.noauth.forgotpassword('POST', {}, data, '127.0.0.1', testId);
  });
  it('Test if method is not POST', function(done){
    var testId = 'testerID2';
    var data = {email: 'a_terrible_email'};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.methodNotSupported()));
      done();
    });
    controller.module.noauth.forgotpassword('GET', {}, data, '127.0.0.1', testId);
  });
});

// ----------------------------------------------------------------------------
// Forgot password phase two
describe('===> Testing Reset Password subscriber controller: \n', function(){
  it('If a token is not provided, a msg.missingResetToken() should be returned', function(done){
    var testId = 'testerID1';
    var data = {reset_token: '', password: 'new password'};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.missingResetToken()));
      done();
    });
    controller.module.noauth.resetpassword('POST', {}, data, '127.0.0.1', testId);
  });
  it('If an invalid token is provided, a msg.badResetToken() should be returned', function(done){
    var testId = 'testerID1';
    var data = {reset_token: 'bad token', password: 'new password'};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.badResetToken()));
      done();
    });
    controller.module.noauth.resetpassword('POST', {}, data, '127.0.0.1', testId);
  });
  it('If a new password is not provided, a msg.missingPwd() should be returned', function(done){
    var testId = 'testerID1';
    var data = {reset_token: 'ffffffff-ffff-ffff-ffff-ffffffffffff', password: ''};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.missingPwd()));
      done();
    });
    controller.module.noauth.resetpassword('POST', {}, data, '127.0.0.1', testId);
  });
  it('If an invalid token is provided, a msg.badResetToken() should be returned', function(done){
    var testId = 'testerID1';
    var data = {reset_token: 'ffffffff-ffff-ffff-ffff-ffffffffffff', password: 'bad pwd'};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.badPwd()));
      done();
    });
    controller.module.noauth.resetpassword('POST', {}, data, '127.0.0.1', testId);
  });
  it('Test if method is not POST', function(done){
    var testId = 'testerID1';
    var data = {reset_token: 'ffffffff-ffff-ffff-ffff-ffffffffffff', password: 'bad pwd'};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.methodNotSupported()));
      done();
    });
    controller.module.noauth.resetpassword('GET', {}, data, '127.0.0.1', testId);
  });
});

// -------------------------------------------------------------------------------------
// Edit Password Test
describe('===> Testing editing of subscriber password: \n', function(){
  var session = { 
    subscriber_id:1,
    key: '121212',
    timeout: '123'
  };
  it('Test if old password not provided', function(done){
    var testId = 'testerID9';
    var data = {email: 'ash.1382@gmail.com', oldPassword: '', newPassword: 'new123password'};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.missingPwd()));
      done();
    });
   controller.module.auth.editpassword(session,'POST', {}, data, '127.0.0.1', testId);
  });
  it('Test if new password not provided', function(done){
    var testId = 'testerID10';
    var data = {oldPassword: 'my123password', newPassword: ''};
    events.Emitter.once(testId, function(result){
      assert.equal(JSON.stringify(result), JSON.stringify(msg.missingPwd()));
      done();
    });
    controller.module.auth.editpassword(session,'POST', {}, data, '127.0.0.1', testId);
  });
  it('Test if new password is bad', function(done){
    var testId = 'testerID11';
    var data = {oldPassword: 'my123password', newPassword: 'what'};
    events.Emitter.once(testId, function(result){
     assert.equal(JSON.stringify(result), JSON.stringify(msg.badPwd(data.email)));
     done();
    });
    controller.module.auth.editpassword(session,'POST', {}, data, '127.0.0.1', testId);
   });
   it('Test if method is not POST', function(done){
    var testId = 'testerID11';
    var data = {oldPassword: 'my123password', newPassword: 'what'};
    events.Emitter.once(testId, function(result){
     assert.equal(JSON.stringify(result), JSON.stringify(msg.methodNotSupported()));
     done();
    });
    controller.module.auth.editpassword(session,'GET', {}, data, '127.0.0.1', testId);
   });
});

//-------------------------------------------------------------------------------------
// Session Authenticate Test
describe('===> Testing Session Authenticate controller: \n', function(){
	
	it('Test if token provided is invalid', function(done){
		var headers = {'x-access-token': 'invalid_token'}
		controller.authenticate(headers, function(result){
			assert.equal(JSON.stringify(result), JSON.stringify(msg.badAccessToken()));
			done();
		});
	});
});
});
