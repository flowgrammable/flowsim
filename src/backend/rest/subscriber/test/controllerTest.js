var assert = require('assert');

var msg = require('../msg.js');
var subController = require('../controller.js');
var testAdapter = require('./testAdapter.js');
var events = require('../../../events.js');

var controller = subController(testAdapter);

//-----------------------------------------------------------------------------
// Registration Controller Tests

describe('===> Testing Register subscriber controller: \n', function(){

  it('Test if subscriber registered successfully', function(done){
		var testId = 'testerID';
    var data = {email: 'test@test.com', password: 'tester10'};

		events.Emitter.once(testId, function(result){
		assert.equal(JSON.stringify(result), JSON.stringify({value:{},tunnel:{}}));
		done();
		});
  controller.module.noauth.register('POST', {}, data, '127.0.0.1', testId);
	});

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
});

// ----------------------------------------------------------------------------
// Verification Test
describe('===> Testing Verify subscriber controller: \n', function(){
	
	it('Test if token provided invalid', function(done){
		var testId = 'testerID1';
	    	var data = {};
	    	var params = ['doesnt_matter_only_looking_for_params1', 'an_invalid_token'];
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
	
});

// -------------------------------------------------------------------------------------
// Reset Test
describe('===> Testing Reset subscriber controller: \n', function(){

	it('Test if email not provided', function(done){
        	var testId = 'testerID1';
   		var data = {email: '', password: 'tester'};
                events.Emitter.once(testId, function(result){
               		 assert.equal(JSON.stringify(result), JSON.stringify(msg.missingEmail()));
               		 done();
               		 });
 	 controller.module.noauth.reset('POST', {}, data, '127.0.0.1', testId);
       	 });

 	 it('Test if email provided invalid', function(done){
                var testId = 'testerID2';
   		var data = {email: 'a_terrible_email', password: 'tester'};
                events.Emitter.once(testId, function(result){
                assert.equal(JSON.stringify(result), JSON.stringify(msg.badEmail(data.email)));
                done();
                });
 	 controller.module.noauth.reset('POST', {}, data, '127.0.0.1', testId);
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
