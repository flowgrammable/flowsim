var _ = require('underscore');
var async = require('async');
var msg = require('./msg');
var adapter = require('./adapter');
var config = true;

function resultChecker(result, callback){
  if(result.value){
    callback(null, result);
  } else if(result.error) {
    callback(result, null);
  } else {
    throw "Undefined success and error objects";
  }
}

// ----------------------------------------------------------------------------
// Packet

function packCreate(adapter, name, session, cb) {
  // 1. Insert User created packet
  async.waterfall([
    function(callback){
      adapter.createPacket(name, session.subscriber_id, function(result){
      resultChecker(result, callback);
      });
    },
  ], function(err, result){
      if(err) { cb(err);    } 
      else    { cb(result); }
  });
}


function packList(adapter, session, cb) {
  async.waterfall([
    function(callback){
      adapter.fetchPacket(session.subscriber_id, function(result){
      resultChecker(result, callback);
      });
    },
  ], function(err, result){
      if(err) { cb(err);    }
      else    { cb(result); }
  });
}

module.exports = function(testAdapter) {
  if(testAdapter){
		adapter = testAdapter;
  }
  return {
    packet: {
      create: _.bind(packCreate, null, adapter),
      //update: _.bind(packUpdate, null, adapter),
      //delete: _.bind(packDelete, null, adapter),
      list:  _.bind(packList, null, adapter)
    }
  };
}

