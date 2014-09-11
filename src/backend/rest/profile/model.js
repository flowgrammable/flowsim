var _ = require('underscore');
var async = require('async');

var msg = require('./msg');
var adapter = require('./adapter');
var modelUtils = require('./modelUtils.js');

function resultChecker(result, callback){
  if (result.value) callback(null, result);
  else if (result.error) callback(result, null);
  else throw "Undefined success and error objects";
}

// ----------------------------------------------------------------------------
// Profile

// The profileCreate function is responsible for creating and inserting
// a profile with the given information into the database. This is done
// through a call to the createProfile adapter function. If successful, 
// msg.success() is returned, if unsuccessful the error is returned.
function profileCreate(adapter, subId, data, cb) {
  var prof = modelUtils.generateProfileData(subId, data);
  adapter.createProfile(prof, function(result) { 
    if (result.value) cb(msg.success());
    else cb(result); 
  });
}


// The profileUpdate function is responsible for updating a switch
// profile to contain the provided values. This is done in two async
// phases. First, the profile is fetched from the database by the
// id given in the request body, and the subscriber_id, which was 
// retrieved through the session. These semantics ensure that a
// subscribers may only modify their own profiles. If the fetch is
// successful, the adapter function to update the profile's attributes 
// is called, resulting in either a msg.success() or error message 
// being returned.
function profileUpdate(adapter, subId, newProfInfo, cb) {
  async.waterfall([
    function(callback){
      var profInfo = { subscriber_id: subId, id: newProfInfo.id };
      adapter.fetchProfile(profInfo, function(result){
        resultChecker(result, callback);
      });
    },
    function(result, callback){
      var profile = result.value;
      adapter.updateProfile(profile, newProfInfo, function(result) {
        resultChecker(result, callback);
      });
    }
    ], function(err, result){
      if(err) { cb(err); }
      else    { cb(msg.success()); }
    });
}

// The profileList function is responsible for returning the list 
// of switch profiles that belong to a subscriber. This list is 
// retrieved through a call to the listProfiles adapter function.
// If successful, a success message containing the list of profiles
// is returned, otherwise the error message is returned.
function profileList(adapter, subId, cb) {
  adapter.listProfiles(subId, function(result){ 
    if (result.error) cb(result);
    else {
      var profs = result.value;
			var list = new Array();
      // all profiles w/all attributes are in an array so we need to 
      // filter the result for the id and name
      for (var i = 0; i < profs.length; i++){
        list[i] = { 
          id: profs[i].id, 
          name: profs[i].name,
          ofp_version: profs[i].ofp_version
        }; console.log(profs[i].dataValues)}
      cb(msg.success(list)); 
    }
  });
}

// Work in progress
function profileDetail(adapter, subId, profId, cb) {
  async.waterfall([
    function(callback){
      var profInfo = { subscriber_id: subId, id: profId };
      adapter.fetchProfile(profInfo, function(result){
        resultChecker(result, callback);
      });
    },
    function(result, callback){
      var profile = result.value;
      adapter.fetchProfileDetails(profile, function(result) {
        resultChecker(result, callback);
      });
    }
    ], function(err, result){
      if(err) { cb(err); }
      else    { cb(result); }
    });
}

// The profileDestroy function is responsible for deleting the
// profile with the given id from the database. This is done in two 
// async phases. First, the profile is fetched from the database by
// the id given in the url of the request, and the subscriber_id, 
// which was retrieved through the session. These semantics ensure 
// that a subscriber may only delete their own profiles. If the fetch 
// is successful, the adapter function to update the profile's 
// attributes is called, resulting in either a msg.success() or 
// error message being returned.
function profileDestroy(adapter, subId, profId, cb) {
  async.waterfall([
    function(callback){
      var profInfo = { subscriber_id: subId, id: profId };
      adapter.fetchProfile(profInfo, function(result){
        resultChecker(result, callback);
      });
    },
    function(result, callback){
      var profile = result.value;
      adapter.destroyProfile(profile, function(result) {
        resultChecker(result, callback);
      });
    }
    ], function(err, result){
      if(err) { cb(err); }
      else    { cb(result); }
    });
}

// ----------------------------------------------------------------------------

module.exports = function(testAdapter) {
  if(testAdapter) adapter = testAdapter;
  return {
    profile: {
      create:   _.bind(profileCreate, null, adapter),
      destroy:  _.bind(profileDestroy, null, adapter),
      detail:   _.bind(profileDetail, null, adapter),
      update:   _.bind(profileUpdate, null, adapter),
      list:     _.bind(profileList, null, adapter)
    }
  };
}

