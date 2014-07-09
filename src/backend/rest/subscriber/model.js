var _ = require('underscore');
var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
var async = require('async');

var msg = require('./msg');
var mailer = require('../../mailer');
var orm = require('../../dbbs');
var adapter = require('./adapter');
// Start subscriber ids from some random 5 digit prime
var base = 19543;



/*
1. Create user
2. check for success or error
3. if success, sendemail
   if error, go back to rest controller
4. check sendmail error or success
5. if success, send success
   if error, send error
*/
function resultChecker(result, cb){
  if(result.success){
    cb(null, result);
  } else if(result.error) {
    cb(result, null);
  } else {
    throw "Undefined success and error objects";
  }
}

function subCreate(adapter, em, pwd, cb) {
  
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

function subVerify(db, token) {
  var result = subGetByField(db, "verfication", token);
  if(!result) return msg.badToken();
  if(result.state != 'CREATED') return msg.badVerificationState();
  result.state = 'ACTIVE';
  return msg.success();
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
      create: _.bind(subCreate, null, adapter)
//      verify: _.bind(subVerify, null, db),

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

