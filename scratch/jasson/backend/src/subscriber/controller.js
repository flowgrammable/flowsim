
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

function Controller(s, m, t, h) {
  this.storage  = s;
  this.mailer   = m;
  this.template = t;
  this.server   = h;
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
    callback(err, { subscriber_id: succ.sub_id, session_id: succ.id });
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
  console.log('login-controller');
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
            callback(_err, token);
        });
      } else {
        callback(msg.incorrectPwd());
      }
    }
  });
};

Controller.prototype.logout = function(token, callback) {
  // if a valid session then delete the session
  this.storage.deleteSession(token, callback);
};

Controller.prototype.register = function(email, pwd, srcIp, callback) {
  var current, token, hash;
  current = new Date();
  token = uuid.v4();
  hash = bcrypt.hashSync(pwd, 10);
  // Create the subscriber entry and send the verification email
  this.storage.createSubscriber(email, hash, current.toISOString(), srcIp, 
                                token, function(err, succ) {
    var subject, body, current, token, hash;
    if(err) {
      console.log('create error');
      callback(err);
    } else {
      subject = '';
      console.log('blah');
      body = this.template.render('verification', {
        baseUrl: this.server.baseUrl(),
        token: token
      });
      console.log('token: %s', token);
      this.mailer.send(email, subject, body, callback);
    }
  });
};

Controller.prototype.verify = function(token, callback) {
  // if the verification token is valid update
  // subscriber state
  // otherwise send an error
  this.storage.verifySubscriber(token, callback);
};

Controller.prototype.forgot = function(email, callback) {
  // update the subscriber state and send and email
  // or send an error
  var token = uuid.v4();
  this.storage.resetSubscriber(email, token, function(err, succ) {
    var body, subject;
    if(err) {
      callback(err);
    } else {
      body = this.mailer.render('forgot', {
        baseUrl: this.server.baseUrl(),
        token: token
      });
      this.mailer.send(email, subject, body, callback);
    }
  });
};

Controller.prototype.update = function(subscriber_id, session_id, oldPwd, 
                                       newPwd, callback) {
  this.storage.getSubscriberById(subscriber_id, function(err, succ) {
    var hash;
    if(err) {
      callback(err);
    } else {
      if(bcrypt.compareSync(oldPwd, succ.password)) {
        hash = bcrypt.hashSync(newPwd, 10);
        this.storage.updateSubscriberPassword(subscriber_id, hash, callback);
      } else {
        callback(msg.incorrectPwd());
      }
    }
  });
};

})();

