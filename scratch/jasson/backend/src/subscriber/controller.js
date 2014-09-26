
/**
 * @module subscriber
 */

(/** @lends module:subscriber */function(){

var uuid   = require('node-uuid');
var bcrypt = require('bcrypt');

var fmt = require('../utils/formatter');
var msg = require('../utils/msg');
var stg = require('./storage');

/**
 * @constructor
 * @param {object} context - blah
 */

function Controller(context) {
  this.storage  = new stg.Storage(context.database);
  this.mailer   = context.mailer;
  this.template = context.template;
}
exports.Controller = Controller;

Controller.prototype.toFromatter = function(f) {
  f.begin('Controller');
  this.storage.toFormatter(f);
  this.mailer.toFormatter(f);
  this.template.toFormatter(f);
  f.end();
};

Controller.prototype.toString = fmt.toString;

Controller.prototype.authorize = function(token, delegate) {
  this.storage.getSession(token, delegate); 
};

Controller.prototype.login = function(email, pwd, callback) {

  async.waterfall([
    function(cb) {
      this.storage.getSubscriberByEmail(email,cb);
    },
    function(result, cb) {
      if(bcrypt.compareSync(pwd, result.password)) {
        this.storage.createSession(uuid.v4(), result.id, timeout, cb);
      } else {
        cb(msg.incorrectPwd());
      }
    }
  ], function(err, result) {
    if(err) {
      callback(msg.error(err));
    } else {
      callback(msg.success(result));
    }
  });

  // Grab the corresponding subscribers data
  this.storage.getSubscriberByEmail(email, function(err, result) {
    if(err) {
      callback(err);
    } else {
      if(bcrypt.compareSync(pwd, result[0].password)) {
        this.storage.createSession(uuid.v4(), id, timeout, 
          function(err, result) {
            if(err) {
              callback(err);
            } else {
              // need to set the verification_token
              result.verification_token
              // session was created 
            }
        });
      } else {
        // The supplied password does not match
        callback(msg.incorrectPwd());
      }
    }
  });
};

Controller.prototype.logout = function(token, callback) {
  // if a valid session then delete the session
  this.storage.deleteSession(token, callbac);
};

Controller.prototype.register = function(email, pwd, srcIp, callback) {
  // create the subscriber, send a verification email
  // or return an error
  this.storage.createSubscriber(email, bycrypt.hashSync(pwd, 10), 
    (new Date()).toISOString(), srcIp, uuid.v4(), callback);
};

Controller.prototype.verify = function(token, callback) {
  // if the verification token is valid update
  // subscriber state
  // otherwise send an error
  this.storage.verifySubscriber(token, callback);
};

Controller.prototype.reset = function(email, callback) {
  // update the subscriber state and send and email
  // or send an error
  this.storage.resetSubscriber(email, uuid.v4(), callback);
};

})();

