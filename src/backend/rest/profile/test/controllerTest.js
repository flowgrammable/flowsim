var assert = require('assert');

var msg = require('../msg.js');
var testAdapter = require('./testAdapter.js');
var controller = require('../controller.js')(testAdapter);
var events = require('../../../events.js');

//-----------------------------------------------------------------------------
// Create Profile Controller Tests
describe('===> Testing create profile controller: \n', function(){
  it('Test if name not provided', function(done){
		var testId = 'testerID1';
    var session = { subscriber_id: 1, key: '', timeout: '' };
    var data = { name: '' };
		events.Emitter.once(testId, function(result){
		  assert.equal(JSON.stringify(result), JSON.stringify(msg.missingName()));
		  done();
		});
  controller.module.auth.create(session, 'POST', {}, data, '127.0.0.1', testId);
	});
});
