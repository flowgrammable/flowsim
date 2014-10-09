
/**
 * @module subscriber
 * @requires module:utils~Formatter module:storage
 */

(/** @lends module:subscriber */function(){

var uuid   = require('node-uuid');
var bcrypt = require('bcrypt');

var fmt = require('../utils/formatter');
var msg = require('./msg');
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
 * @param {Object} context.logger   - logger engine
 */

function Controller(s, m, t, h, l) {
  this.storage  = s;
  this.mailer   = m;
  this.template = t;
  this.server   = h;
  this.logger   = l;
}
exports.Controller = Controller;


Controller.prototype.toFormatter = function(f) {
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
  console.log('authorizing: ' + token);
  this.storage.getSession(token, function(err, succ) {
    if(err) {
      callback(err);
    } else {
    callback(null, { subscriber_id: succ.subscriber_id, session_id: succ.id });
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
  var that = this;
  this.storage.getSubscriberByEmail(email, function(err, succ) {
    var token, expireTime;
    if(err) {
      that.logger.error(err);
      callback(err);
    } else {
      if(bcrypt.compareSync(pwd, succ.password)) {
        token = uuid.v4();
        expireTime = new Date((new Date()).getTime() + defTimeout * 60000);
        that.storage.createSession(token, succ.id, expireTime.toISOString(),
          function(_err, session) {
            if(_err){
              that.logger.error(_err);
              callback(_err);
            }
            callback(null, session.key);
        });
      } else {
        callback(msg.invalidPassword());
      }
    }
  });
};

/**
 * Given a session id attempt to remove session entry from database.
 *
 * @param {Integer} sessionID - session entry id
 * @param {Function} callback - standard callback
 */
Controller.prototype.logout = function(sessionID, callback) {
  // if a valid session then delete the session
  console.log('logout: ' + sessionID);
  this.storage.deleteSession(sessionID, callback);
};

Controller.prototype.register = function(email, pwd, srcIp, callback) {
  var current, token, hash, that;
  current = new Date();
  token = uuid.v4();
  hash = bcrypt.hashSync(pwd, 10);
  that = this;
  // Create the subscriber entry and send the verification email
  this.storage.createSubscriber(email, hash, current.toISOString(), srcIp,
                                token, function(err, succ) {
    var subject, body;
    if(err) {
      that.logger.error(err);
      callback(err);
    } else {
      subject = 'Flowsim Verify Email Address';
      body = that.template.render('verification', {
        baseUrl: that.server.baseUrl(),
        token: token
      });
      that.mailer.send(email, subject, body);
      callback(null, msg.success());
    }
  });
};

/**
 * Given a token attempt the verify the subscriber associated with it.
 *
 * @param {String} token - verification token
 * @param {Function} callback - standard callback
 */
Controller.prototype.verify = function(token, callback) {
  // if the verification token is valid update
  // subscriber state
  // otherwise send an error
  var that = this;
  this.storage.verifySubscriber(token, function(err, result){
    if(err){
      callback(err);
      that.logger.error(err);
    } else {
      callback(null, result);
    }
  });
};

/**
 * Given an email attempt to reset subscriber password. A reset token is
 * generated and sent in an email to subscriber.
 *
 * @param {String} email - subscriber email address
 * @param {Function} callback - standard callback
 */
Controller.prototype.forgot = function(email, callback) {
  // update the subscriber state and send and email
  // or send an error
  var token = uuid.v4();
  var that = this;
  this.storage.resetSubscriber(email, token, function(err, succ) {
    var body, subject;
    if(err) {
      that.logger.error(err);
      callback(err);
    } else {
      body = that.template.render('reset', {
        baseUrl: that.server.baseUrl(),
        token: token
      });
      that.mailer.send(email, subject, body);
      callback(null, result);
    }
  });
};

/**
 * Given a reset token and password attempt to update subscriber password.
 * The subscriber state is moved to 'ACTIVE'
 *
 * @param {String} email - subscriber email address
 * @param {Function} callback - standard callback
 */
Controller.prototype.reset = function(token, password, callback) {
  var hash = bcrypt.hashSync(password, 10);
  var that = this;
  this.storage.updateSubscriberPasswordByToken(token, hash,
    function(err, result){
      if(err){
        that.logger.error(err);
        callback(err);
      } else {
        callback(null, result);
      }
  });
};

Controller.prototype.update = function(subscriber_id, session_id, oldPwd,
                                       newPwd, callback) {
  var that = this;
  console.log('update: ' + subscriber_id);
  this.storage.getSubscriberById(subscriber_id, function(err, succ) {
    var hash;
    if(err) {
      callback(err);
    } else {
      if(bcrypt.compareSync(oldPwd, succ.password)) {
        hash = bcrypt.hashSync(newPwd, 10);
        that.storage.updateSubscriberPassword(subscriber_id, hash, callback);
      } else {
        callback(msg.invalidPassword());
      }
    }
  });
};

})();
