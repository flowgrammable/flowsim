var _ = require('underscore');
var async = require('async');
var bcrypt = require('bcrypt');

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
// Subscriber

function subCreate(adapter, em, pwd, ip, cb) {
  // 1. Insert User
  // 2. Send Verification Email
  async.waterfall([
    function(callback){
      adapter.insertSubscriber(em, pwd, ip, function(result){
      resultChecker(result, callback);
      });
    },
    function(result, callback){
      adapter.sendVerificationEmail(result.value, config, function(result){
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
  // 3. generate auth token
  async.waterfall([
    function(callback){
      adapter.fetchSubscriber({verification_token: token}, function(result){
        resultChecker(result, callback);
      });
    },
    function(result, callback){
      adapter.verifySubscriber(result.value , function(result){
        resultChecker(result, callback);
      });
    },
		function(result, callback){
			adapter.verifyRedirect(function(result){
				resultChecker(result, callback);
			});
		}
    ], 
    function(err, result){
      if(err) { cb(err); }
      else    { cb(result); }
    });
}

function subReset(adapter, email, cb) {
  // 1. Generate password reset token
  // 2. associate it with user
  // 3. send email with token
  async.waterfall([
    function(callback){
      adapter.generateResetToken()
    }
    ], function(err, result){
        if(err) { cb(err); }
        else    { cb(result);}

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

function sessDestroy(adapter, session, cb){
  adapter.destroySession(session, function(result){
    cb(result);
  });
}


// function subUpdate(db, id, row) {
//   var table = db.subscribers;
//   id -= base;
//   if(id < 0 || id >= table.length) return "badId";
//   table[id] = row;
//   return "";
// }

// function subDestroy(db, id) {
//   var table = db.subscribers;
//   id -= base;
//   if(id < 0 || id >= table.length) return "badId";
//   table.splice(id, 1);
//   return "";
// }

function sessGetByAccessToken(adapter, sessKey, cb) {
  adapter.fetchSession(sessKey, function(result){
    // console.log(result);
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
    subscriber: {
      create: _.bind(subCreate, null, adapter),
      verify: _.bind(subVerify, null, adapter),

//      update: _.bind(subUpdate, null, db),
//      destroy: _.bind(subDestroy, null, db)
    },
    session: {
//      create: _.bind(createSession, null, adapter),
      destroy: _.bind(sessDestroy, null, adapter),
      authenticate: _.bind(sessAuthenticate, null, adapter),

      getByAccessToken: _.bind(sessGetByAccessToken, null, adapter)
    }
  };
}

