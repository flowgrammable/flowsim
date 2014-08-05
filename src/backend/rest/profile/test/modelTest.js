var bcrypt = require('bcrypt');

var testAdapter = require('./testAdapter.js');
var assert = require('assert');
var model = require('../model.js')(testAdapter);
var msg = require('../msg.js');

//------------------------------------------------------------------------------
// Registration Tests
describe('===> Testing profileCreate: \n',function() {
  it('Profile created successfully',function(done) {
  	model.profile.create(1, 'test profile', function(result){
  		assert(result.value, "Could not create profile");
		  done();
	  });
  });
  it('Duplicate profile',function(done) {
  	model.profile.create(1, 'test profile', function(result){
  		assert.equal(result.error.type, "nameInUse");
		  done();
	  });
  });
});
