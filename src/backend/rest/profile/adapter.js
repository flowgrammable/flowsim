var msg = require('./msg');
var orm = require('../../dbbs');
var subAdapter = require('../subscriber/adapter');

var Profile = orm.model("switch_profile");
var DpCaps = orm.model("dp_caps");
var FtCaps = orm.model("ft_caps");

// ----------------------------------------------------------------------------
// Profile

// The createProfile function creates and makes a database insert 
// for the profile and any related table entries whose fields can 
// be inferred based on the ofp_version
function createProfile(subId, name, ver, cb) {
  var prof;
	console.log('sub id from adapter: ', subId);
  Profile.create({ 
    subscriber_id: subId, 
    name: name, 
    ofp_version: ver 
  }).then(function(profile) {
    prof = profile;  
    console.log('profile id from subcreate: ', prof.id); 
	  return DpCaps.create(generateDpCaps(prof.id, ver)); 
  }).then(function(dp_caps) { 
    return FtCaps.create(generateFtCaps(dp_caps.id, ver)); 
  }).then(function(ft_caps) { cb(msg.success(prof)) })
}

// The generateDpCaps function returns values for the dp_caps table 
// entry based on the ofp_version passed in.
function generateDpCaps(profId, version) {
  console.log('profId from gen dp caps: ', profId);
  if (version == 10) 
    return {
      profile_id:    profId,
      vp_all:        true, 
      vp_controller: true, 
      vp_table:      true,
      vp_in_port:    true,
      vp_any:        true,
      vp_local:      true,
      vp_normal:     true,
      vp_flood:      true
    }
}

// The generateDpCaps function returns values for the dp_caps table 
// entry based on the ofp_version passed in.
function generateFtCaps(dpId, version) {
  if (version == 10) 
    return {
      dp_id:       dpId,
      table_id:    1,
      max_entries: 1
    }
}

// The fetchProfile function retrieves a profile based on the info
// passed in. If successful, a success message containing the profile 
// is returned. If no profile is found, msg.profileNotFound() is 
// returned. 
function fetchProfile(profileInfo, cb) {
  Profile.find({ where: profileInfo })
    .success(function(result) {
      if (result == null) cb(msg.profileNotFound());
      else cb(msg.success(result));
    }).error(function(err) { cb(msg.unknownError(err)); });
}

// The fetchProfileDetails function retrieves all of the table entries
// associated with the profile passed in. If successful, a success 
// message containing an object with each of the table entries is
// returned.
function fetchProfileDetails(profile, cb) {
  var dp_caps, ft_caps;
  profile.getDpCaps()
  .then(function(dpCaps){
		console.log('dpcaps: ', dpCaps);
    dp_caps = dpCaps.values;
    return dpCaps.getFtCaps()
  }).then(function(ftCaps){
    ft_caps = ftCaps.values;
    cb(msg.success({ dp_caps: dp_caps, ft_caps: ft_caps }))
  })
}

// The listProfiles function retrieves all profiles based on the 
// sub id passed in. If successful, a success message containing
// the list of profiles is returned. 
function listProfiles(subId, cb) {
  Profile.findAll({ where: { subscriber_id: subId } })
    .success(function(profiles) { cb(msg.success(profiles)); })
    .error  (function(err)      { cb(msg.unknownError(err)); })
}

// The updateProfile function updates the profile's attributes
// based on the info passed in. If successful, a success message 
// containing the resulting profile is returned.
function updateProfile(profile, newProfileInfo, cb) {
  profile.updateAttributes(newProfileInfo)
    .success(function(result) { cb(msg.success(result)); })
    .error  (function(err)    { cb(msg.unknownError(err)); });
}

// The destroyProfile function destroys the profile passed in,
// removing it from the database. If successful, an empty success 
// message is returned.
function destroyProfile(profile, cb) {
  profile.destroy()
    .success(function(result) { cb(msg.success()); })
    .error  (function(err)    { cb(msg.unknownError(err)); });
}

exports.createProfile         = createProfile;
exports.fetchProfile          = fetchProfile;
exports.fetchProfileDetails   = fetchProfileDetails;
exports.listProfiles          = listProfiles;
exports.updateProfile         = updateProfile;
exports.destroyProfile        = destroyProfile;
