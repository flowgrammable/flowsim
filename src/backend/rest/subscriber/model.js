var _ = require('underscore');
var async = require('async');

var msg = require('./msg');
var adapter = require('./adapter');

function resultChecker(result, callback){
  if(result.value){
    callback(null, result);
  } else if(result.error) {
    callback(result, null);
  } else {
    throw "Undefined success and error objects";
  }
}

function subCreate(adapter, em, pwd, cb) {
  // 1. Insert User
  // 2. Send Verification Email

  async.waterfall([
    function(callback){
      adapter.insertSubscriber(em, pwd, function(result){
        resultChecker(result, callback);
      });
    },
    function(result, callback){
      adapter.sendEmail(em, function(result){
        resultChecker(result, callback);
      });
    }
  ], function(err, result){
      if(err) { cb(err);    } 
      else    { cb(result); }
  });

}

function subVerify(adapter, token, cb) {
  // 1. Fetch user by verificationToken
  // 2. Set user to verified

  async.waterfall([
    function(callback){
      adapter.fetchSubscriber(token, function(sub){
        resultChecker(result, callback);
      });
    },
    function(sub, callback){
      adapter.verifySubscriber(sub, function(result){
        resultChecker(result, callback);
      });
     }
    ], function(err, result){
        if(err) { cb(err); }
        else    { cb(result); }
    });
}

function subReset(db, email) {
  var result = subGetByField(db, "email", email);
  if(!result) return msg.badEmailReset();
}

function subUpdate(db, id, row) {
  var table = db.subscribers;
  id -= base;
  if(id < 0 || id >= table.length) return "badId";
  table[id] = row;
  return "";
}

function subDestroy(db, id) {
  var table = db.subscribers;
  id -= base;
  if(id < 0 || id >= table.length) return "badId";
  table.splice(id, 1);
  return "";
}

function sessGetByAccessToken(db, token) {
  var i;
  for(var i=0; i<db.sessions.length; ++i) {
    if(db.sessions[i].accessToken = accessToken)
      return db.session[i];
  }
  return null;
}

module.exports = function(db) {
  return {
    subscriber: {
      create: _.bind(subCreate, null, adapter),
      verify: _.bind(subVerify, null, adapter),

//      update: _.bind(subUpdate, null, db),
//      destroy: _.bind(subDestroy, null, db)
    },
    session: {
//      create: _.bind(sessCreate, null, db),
//      destroy: _.bind(sessDestroy, null, db),
//      authenticate: _.bind(sessAuthenticate, null, db);

//      getByAccessToken: _.bind(sessGetByAccessToken, null, db)
    }
  };
}

