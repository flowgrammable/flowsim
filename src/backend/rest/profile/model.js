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

function profileCreate(adapter, subId, name, ver, cb) {
  adapter.createProfile(subId, name, ver, function(result) { 
    if (result.value) cb(msg.success());
    else cb(result); 
  });
}

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

function profileList(adapter, subId, cb) {
  adapter.listProfiles(subId, function(result){ 
    var list = new Array();
    // way 1: all profiles w/all attributes are in an array so we need to 
    // strip the subscriber_id from it

    // var profs = result.value;
    // for(i in profs) 
    //   list[i] = { id: profs[i].id, name: profs[i].name, ofp_version: profs[i].ofp_version }
    // cb(msg.success(list)); 

    // way 2: all profiles w/only the attributes we are interested in are
    // in an array, but they contain extra sequelize info that is removed
    var profs = result.value;
    for (i in profs) list[i] = profs[i].dataValues; 
    cb(msg.success(list)); 
  });
}

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

