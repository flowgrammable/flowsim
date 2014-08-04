var adapter = require('./testAdapter.js');
var assert = require('assert');

var profile;

// ----------------------------------------------------------------------------
// Testing createProfile
describe('===> Testing createProfile adapter function:\n', function() {
  it('Profile created successfully', function(done) {
    adapter.createProfile("test profile", function (result) {
      assert(result.value, "Unable to create profile")
      done();
    });
  });
});

// ----------------------------------------------------------------------------
// Testing fetchProfile
describe('===> Testing fetchProfile adapter function:\n', function() {
  it('Profile fetched successfully', function(done) {
    adapter.fetchProfile({ name: "test profile" }, function (result) {
      assert(result.value, "Unable to fetch profile")
      profile = result.value;
      done();
    });
  });
  it('Profile not found', function(done) {
    adapter.fetchProfile({ name: "nonexistent profile" }, function (result) {
      assert.equal(result.error.type, "profileNotFound")
      done();
    });
  });
});

// ----------------------------------------------------------------------------
// Testing updateProfile
describe('===> Testing updateProfile adapter function:\n', function() {
  it('Profile updated successfully', function(done) {
    adapter.updateProfile(profile, { name: "updated profile" }, function (result) {
      assert(result.value, "Unable to update profile")
      done();
    });
  });
});

// ----------------------------------------------------------------------------
// Testing destroyProfile
describe('===> Testing destroyProfile adapter function:\n', function() {
  it('Profile destroyed successfully', function(done) {
    adapter.destroyProfile(profile, function (result) {
      assert(result.value, "Unable to destroy profile")
      done();
    });
  });
});
