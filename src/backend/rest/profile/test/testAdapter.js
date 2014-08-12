var msg = require('../msg');

var database = require('../../../database.js');
var Profile = database['switch_profile'];


// ----------------------------------------------------------------------------
// Database Functionality

Array.prototype.findProfile = function(info) {
  // if no search info was provided return null
  if (!info.id && !info.subscriber_id && !info.name && !info.ofp_version) 
    return null;
  // check each profile against the provided information
  for (i in this) {
    if (info.id) if (this[i].id != info.id) continue;
    if (info.subscriber_id) if (this[i].subscriber_id != info.subscriber_id) continue;
    if (info.name) if (this[i].name != info.name) continue;
    if (info.ofp_version) if (this[i].ofp_version != info.ofp_version) continue;
    return this[i]; // if we make it here, we've found the profile
  }
  return null; // if we make it here, the profile wasn't found
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

function createProfile(subId, name, ver, cb) {
  var profToAdd = { 
    id: (Profile[Profile.length-1].id + 1),
    subscriber_id: subId,
    name: name,
    ofp_version: ver
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
  // extend this to include profile details
  if (profileInfo.name) profile.name = profileInfo.name;
  if (profileInfo.ofp_version) profile.ofp_version = profileInfo.ofp_version;
  cb (msg.success(profile));
}

function destroyProfile(profile, cb) {
  if (Profile.deleteProfile(profile)) cb(msg.success());
  else cb(msg.unknownError());
}

function listProfiles(subId, cb) { 
  var list = new Array();
  // add all profiles with the given subId to an array
  for (i in Profile) 
    if (Profile[i].subscriber_id == subId) 
      list.push(Profile[i]);
  cb(msg.success(list)); // return the array with all of the profiles
}

// Shortcut function to directly add a profile to the fake db
function makeProfile(prof, cb) {
  Profile.push(prof); 
}

exports.createProfile  = createProfile;
exports.fetchProfile   = fetchProfile;
exports.listProfiles   = listProfiles;
exports.updateProfile  = updateProfile;
exports.destroyProfile = destroyProfile;
exports.makeProfile    = makeProfile;

