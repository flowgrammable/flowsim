var msg = require('../msg');

var database = require('../../../database.js');
var Profile = database['switch_profiles'];


// ----------------------------------------------------------------------------
// Database Functionality

Array.prototype.findProfile = function(profInfo) {
  var hasSubId, hasName, found;
  if (profInfo.subscriber_id) hasSubId = true;
  if (profInfo.name) hasName = true;
  for (i in this) {
    found = false;
    if (hasSubId) {
      if (this[i].subscriber_id == profInfo.subscriber_id) found = true;
      else continue;
    }
    if (hasVerToken) {
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

Array.prototype.subscriberHasProfileName = function(id, name) {
  for (i in this) 
    if (this[i].subscriber_id == id && this[i].name == name) return true;
  return false;
}

// ----------------------------------------------------------------------------
// Profile Adapter Functions

function createProfile(subId, name, cb) {
  if (Profile.subscriberHasProfileName(subId, name)) cb(msg.nameInUse());
  else {
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
}

function fetchProfile(subId, name, cb) {
  var prof = Profile.findProfile({ subscriber_id: subId, name: name });
  if (prof == null) cb(msg.profileNotFound());
  else cb(msg.success(prof));
}

// NO ERROR HANDLING
function updateProfile(profile, profileInfo, cb) {
  if (profileInfo.name) profile.name = profileInfo.name;
  cb (msg.success(profile));
}

function destroyProfile(profile, cb) {
  if (Profile.deleteProfile(profile)) cb(msg.success());
  else cb(msg.unknownError);
}

function makeProfile(prof, cb) {
  Profile.push(prof); 
}

exports.createSession = createSession;
exports.fetchSession = fetchSession;
exports.destroySession = destroySession;

