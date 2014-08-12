var bcrypt = require('bcrypt');

var testAdapter = require('./testAdapter.js');
var assert = require('assert');
var model = require('../model.js')(testAdapter);
var msg = require('../msg.js');

//------------------------------------------------------------------------------
// Create profile tests
describe('===> Testing profileCreate: \n',function() {
  it('Profile created successfully',function(done) {
  	model.profile.create(1, 'test profile', 10, function(result){
  		assert(result.value, "Could not create profile");
		  done();
	  });
  });
});
