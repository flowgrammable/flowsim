
/**
 * @module subscriber
 * @requires module:utils~Formatter module:storage
 */

(/** @lends module:subscriber */function(){

var uuid   = require('node-uuid');
var bcrypt = require('bcrypt');

var fmt = require('../utils/formatter');
var msg = require('../utils/msg');
var stg = require('./storage');

// Default session timeout in minutes
var defTimeout = 180;

/**
 * A controller containins the primary business logic for all subuscriber module
 * services. It is constructed with references to necessary external services
 * and provides an interface for each of its public service offerings.
 *
 * @constructor
 * @param {Object} context          - wrapper of necessary services
 * @param {Object} context.database - database engine
 * @param {Object} context.mailer   - SMTP engine
 * @param {Object} context.template - template engine
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

/**
 * Determine if the provided token belongs to a valid active session. If
 * the session token is valid subscriber and session identifier.
 *
 * @param {String} token - session token
 * @param {Function} callback - a standard callback function
 */
Controller.prototype.authorize = function(token, callback) {
  this.storage.getSession(token, function(err, succ) {
    if(err) {
      callback(err);
    } else {
      callback(null, {
        subscriber_id: succ.sub_id,
        session_id: succ.id 
      });
    }
  }); 
};

/**
 * Given an email and password attempt to login the subscriber. This involves
 * first validating the email/password, second creating a new session for the
 * subscriber, and third returning the session token needed for further
 * authenticatd requests.
 *
 * @param {String} email - email address to login
 * @param {String} pwd - password to authenticate the email
 * @param {Function} callback - standard callback
 */
Controller.prototype.login = function(email, pwd, callback) {
  this.storage.getSubscriberByEmail(email, function(err, succ) {
    var token, currentTime;
    if(err) { 
      callback(err); 
    } else {
      if(bcrypt.compareSync(pwd, succ.password)) {
        token = uuid.v4();
        currentTime = new Date();
        this.storage.createSession(token, succ.id, 
          new Date(currentTime.gettime() + defTimeout * 60000), 
          function(_err, _succ) {
            if(_err) {
              callback(_err);
            } else {
              callback(null, token);
            }
        });
      } else {
        callback(msg.incorrectPassword());
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

