var bcrypt = require('bcrypt');

var testAdapter = require('./testAdapter.js');
var assert = require('assert');
var model = require('../model.js')(testAdapter);
var msg = require('../msg.js');


//------------------------------------------------------------------------------
// Create profile tests

var profile;
describe('===> Testing profileCreate: \n',function() {
  it('Profile created successfully',function(done) {
  	model.profile.create(1, 'test profile', 10, function(result) {
      profile = result.value;
  		assert(result.value, "Could not create profile");
		  done();
	  });
  });
});

describe('===> Testing profileList: \n',function() {
  it('All profiles listed successfully',function(done) {
    model.profile.list(1, function(result) {
        console.log(result.value);
        assert(result.value, "Could not list profiles");
        done();
      });
  });
});