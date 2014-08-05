var _ = require('underscore');
var async = require('async');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var fs = require('fs');


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

function packCreate(adapter, session, name, cb) {
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

// ----------------------------------------------------------------------------
// Session

function sessAuthenticate(adapter, email, password, cb){
  // 1. Fetch user by email
  // 2. Check credentials
  async.waterfall([
    function(callback){
      adapter.fetchSubscriber({email: email}, function(result){
        resultChecker(result, callback);
      });
    },
    function(result, callback){
      // Subscriber's account must have an active status
      if (result.value.status != 'ACTIVE') 
        resultChecker(msg.subscriberNotActive(result.value), callback);
      else if (!bcrypt.compareSync(password, result.value.password)) // wrong pwd
        resultChecker(msg.incorrectPwd(), callback);
      else {
        adapter.createSession(result.value, function(result){
          resultChecker(result, callback);
        });
      }
    }],
    function(err, result){
      if(err) { cb(err); }
      else    { cb(result); }
    });
}

function sessGetByAccessToken(adapter, sessKey, cb) {
  adapter.fetchSession(sessKey, function(result){
    if (result.value) cb(result.value); 
    else if (result.error.type == 'sessionNotFound') cb(null); 
    else {
      console.log(msg.unknownError(result));
      cb(null);
    } 
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
      list:  _.bind(packList, nul, adapter);
    },
    session: {
      authenticate:     _.bind(sessAuthenticate, null, adapter),
      getByAccessToken: _.bind(sessGetByAccessToken, null, adapter)
    }
  };
}

