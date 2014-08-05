var msg = require('./msg');
var orm = require('../../dbbs');
var Profile = orm.model("switch_profile");

// ----------------------------------------------------------------------------
// Profile

function createProfile(subId, name, cb) {
  Profile.create({ subscriber_id: subId, name: name })
    .success(function(result) { cb(msg.success(result)); })
    .error(function(err) { 
      if(err.detail == 'Key (name)=(' + name + ') already exists.') 
        cb(msg.nameInUse());
      else 
        cb(msg.unknownError(err));
    });
}

function fetchProfile(profileInfo, cb) {
  Profile.find({ where: profileInfo })
    .success(function(result) {
      if (result == null) cb(msg.profileNotFound());
      else cb(msg.success(result));
    }).error(function(err) { cb(msg.unknownError(err)); });
}

function listProfiles(subId, cb) {
  Profile.findAll({ where: { subscriber_id: subId } })
    .success(function(profiles) {
      if(profiles == null) cb(msg.noProfilesFound);
      else cb(msg.success(profiles));
    }).error(function(err) { cb(msg.unknownError(err)); })
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
exports.listProfiles   = listProfiles;
exports.updateProfile  = updateProfile;
exports.destroyProfile = destroyProfile;
