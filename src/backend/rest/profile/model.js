var _ = require('underscore');
var async = require('async');

var msg = require('./msg');
var adapter = require('./adapter');

function resultChecker(result, callback){
  if (result.value) callback(null, result);
  else if (result.error) callback(result, null);
  else throw "Undefined success and error objects";
}

// ----------------------------------------------------------------------------
// Profile

function profileCreate(adapter, subId, name, cb) {
  adapter.createProfile(subId, name, function(result) { cb(result); });
}

function profileUpdate(adapter, subId, oldProfileName, newProfileInfo, cb) {
  async.waterfall([
    function(callback){
      var profInfo = { subscriber_id: subId, name: oldProfileName };
      adapter.fetchProfile(profInfo, function(result){
        resultChecker(result, callback);
      });
    },
    function(result, callback){
      var profile = result.value;
      adapter.updateProfile(profile, newProfileInfo, function(result) {
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
      // destroy:  _.bind(profileDestroy, null, adapter),
      update:   _.bind(profileUpdate, null, adapter),
      // list:     _.bind(profileList, null, adapter)
    }
  };
}

