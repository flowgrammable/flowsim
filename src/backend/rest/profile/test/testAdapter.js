var msg = require('../msg');

var database = require('../../../database.js');
var Profile = database['switch_profiles'];


// ----------------------------------------------------------------------------
// Database Functionality

Array.prototype.findProfile = function(profInfo) {
  var hasId, hasSubId, hasName, found;
  if (profInfo.id) hasId = true;
  if (profInfo.subscriber_id) hasSubId = true;
  if (profInfo.name) hasName = true;
  for (i in this) {
    found = false;
    if (hasId) {
      if (this[i].id == profInfo.id) found = true;
      else continue;
    }
    if (hasSubId) {
      if (this[i].subscriber_id == profInfo.subscriber_id) found = true;
      else continue;
    }
    if (hasName) {
      if (this[i].name == profInfo.name) found = true;
      else continue;
    }
    if (found) return this[i];
  }
  return null;
}

Array.prototype.deleteProfile = function(profile) {
  var success = false;
  for (i in this) 
    if (this[i] == profile) {
      this.splice(i, 1);
      success = true;
    }
  return success;
}

// ----------------------------------------------------------------------------
// Profile Adapter Functions

function createProfile(subId, name, cb) {
  var profToAdd = { 
    id: (Profile[Profile.length-1].id + 1),
    subscriber_id: subId,
    name: name
  };
  Profile.push(profToAdd);
  var newProf = Profile[Profile.length-1];
  if (newProf == profToAdd) cb(msg.success(newProf));
  else cb(msg.unknownError(Profile.pop()));
}

function fetchProfile(profileInfo, cb) {
  var prof = Profile.findProfile(profileInfo);
  if (prof == null) cb(msg.profileNotFound());
  else cb(msg.success(prof));
}

// NO ERROR HANDLING
function updateProfile(profile, profileInfo, cb) {
  // extend this to include version, etc...
  if (profileInfo.name) profile.name = profileInfo.name;
  cb (msg.success(profile));
}

function destroyProfile(profile, cb) {
  if (Profile.deleteProfile(profile)) cb(msg.success());
  else cb(msg.unknownError);
}

function listProfiles(subId, cb) { 
  var list;
  for (i in Profile) {
    if (Profile[i].subscriber_id == subId){
      list[i].id = Profile[i].id;
      list[i].name = Profile[i].name;
      // extend this to include version, etc...
    }
  }
  cb(msg.success(list)); 
}

function makeProfile(prof, cb) {
  Profile.push(prof); 
}

exports.createProfile  = createProfile;
exports.fetchProfile   = fetchProfile;
exports.listProfiles   = listProfiles;
exports.updateProfile  = updateProfile;
exports.destroyProfile = destroyProfile;
exports.makeProfile    = makeProfile;

