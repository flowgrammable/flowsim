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
  		assert(result.value, "Could not create profile");
		  done();
	  });
  });
});



describe('===> Testing profileList: \n',function() {
  it('All profiles listed successfully',function(done) {
    model.profile.list(1, function(result) {
        assert(result.value, "Could not list profiles");
        console.log(result.value);
        done();
      });
  });
});


describe('===> Testing profileUpdate: \n',function() {
  after(function(done) {
    model.profile.list(1,function(result) {console.log(result.value);});
    done();
  })
  it('Profile updated successfully',function(done) {
    model.profile.update(1,{id:2, name: 'updated profile'},
      function(result){
        console.log(result);
        assert(result.value, "Could not update profile");
        done();
      });
  });
});

describe('===> Testing profileDetail: \n',function() {
  it('Successfully fetched profile details',function(done) {
    model.profile.detail(1,2,
      function(result){
        console.log(result.value);
        assert(result.value, "Could not fetch profile details");
        done();
      });
  });
});

describe('===> Testing profileDestroy: \n',function() {
  after(function(done) {
    model.profile.list(1,function(result) {console.log(result.value);});
    done();
  })
  it('Profile destroyed successfully',function(done) {
    model.profile.destroy(1,2,
      function(result){
        assert(result.value, "Could not destroy profile");
        done();
      });
  });
});



