var msg = require('./msg');
var orm = require('../../dbbs');
var Profile = orm.model("profile");

// ----------------------------------------------------------------------------
// Profile

function createProfile(name, cb) {
  Profile.create({ name: name })
    .success(function(result) { cb(msg.success(result)); })
    .error  (function(err)    { cb(msg.unknownError(err)); });
}

function fetchProfile(profileInfo, cb) {
  Profile.find({ where: profileInfo })
    .success(function(result) {
      if (result == null) cb(msg.profileNotFound());
      else cb(msg.success(result));
    }).error(function(err) { cb(msg.unknownError(err)); });
}

function updateProfile(profile, newProfileInfo, cb) {
  profile.updateAttributes(newProfileInfo)
    .success(function(result) { cb(msg.success(result)); })
    .error  (function(err)    { cb(msg.unknownError(err)); });
}

function destroyProfile(profile, cb) {
  profile.destroy()
    .success(function(result) { cb(msg.success()); })
    .error  (function(err)    { cb(msg.unknownError(err)); });
}

exports.createProfile  = createProfile;
exports.fetchProfile   = fetchProfile;
exports.updateProfile  = updateProfile;
exports.destroyProfile = destroyProfile;
