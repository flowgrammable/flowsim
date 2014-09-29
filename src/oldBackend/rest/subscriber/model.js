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
      adapter.sendVerificationEmail(result.value, function(result){
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
      var sub = result.value; // the subscriber
      if (sub.status == 'ACTIVE') 
        resultChecker(msg.subscriberAlreadyVerified(), callback);
      else {
        adapter.updateSubscriber(sub, { status: 'ACTIVE' }, function(result){
          resultChecker(result, callback);
        });
      }
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

function subForgotRequest(adapter, email, cb) { // PHASE ONE
  // 1. Fetch subscriber
  // 2. Generate reset token
  // 3. sendResetEmail(resetMessage(token))
  
  async.waterfall([
    function(callback){
      adapter.fetchSubscriber({email: email}, function(result){
				resultChecker(result, callback);
			});
    },
		function(result, callback){
      var sub = result.value; // the subscriber
      if (sub.status != 'CLOSED')
  			adapter.updateSubscriber(sub, { status: 'RESET', reset_token: uuid.v4() },
        function(result){
  				resultChecker(result, callback);
  			});
      else resultChecker(msg.subscriberClosed(), callback);
		},
		function(result, callback){
      fs.appendFile('temp', '\n{\"reset_token\":"'+result.value.reset_token+'\"}', function (err) {
        if (err) console.log('Unable to write reset token in file for restTest');
      });
			adapter.sendResetEmail(result.value, function(result){
				resultChecker(result, callback);
			});
		}
    ], function(err, result){
        if(err) { cb(err); }
        else    { cb(result); }

    });

}

function subPasswordUpdate(adapter, token, pwd, cb) { // PHASE TWO
  async.waterfall([
    function(callback){
      adapter.fetchSubscriber({ reset_token: token }, function(result){
        resultChecker(result, callback);
      });
    },
    function(result, callback){
      var sub = result.value;
      if (sub.status != 'RESET') resultChecker(msg.subscriberNotReset(), callback);
      else {
        var encrypted = bcrypt.hashSync(pwd, 10); // encrypt the password
        adapter.updateSubscriber(sub, 
        { password: encrypted, status: 'ACTIVE', reset_token: null },
        function(result) {
          resultChecker(result, callback);
        });
      }
    }
    ], function(err, result){
        if(err) { cb(err); }
        else    { cb(msg.success()); }

    });
}

function subEditPassword(adapter, session, oldPassword, newPassword, cb) {
  // 1. Fetch subscriber
  // 2. Update oldPasswd with new
  async.waterfall([
    function(callback){
      adapter.fetchSubscriber({id: session.subscriber_id}, function(result){
        resultChecker(result, callback);
      });
    },
    function(result, callback){
      var sub = result.value; // the subscriber
      if (!bcrypt.compareSync(oldPassword, sub.password)) // wrong pwd
        resultChecker(msg.incorrectPwd(), callback);
      else {
        var encryptPwd = bcrypt.hashSync(newPassword, 10);
        adapter.updateSubscriber(sub, {password: encryptPwd },
        function(result){
          resultChecker(result, callback);
        });
      }
    },
    ], function(err, result){
        if(err) { cb(err); }
        else    { cb(msg.success()); }
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
      create:           _.bind(subCreate, null, adapter),
      verify:           _.bind(subVerify, null, adapter),
      forgotRequest:    _.bind(subForgotRequest, null, adapter),
      passwordUpdate:     _.bind(subPasswordUpdate, null, adapter),
      // update:           _.bind(subUpdate, null, db),
      // destroy:          _.bind(subDestroy, null, db),
      editPasswd:       _.bind(subEditPassword, null, adapter)
    },
    session: {
      destroy:          _.bind(sessDestroy, null, adapter),
      authenticate:     _.bind(sessAuthenticate, null, adapter),
      getByAccessToken: _.bind(sessGetByAccessToken, null, adapter)
    }
  };
}

