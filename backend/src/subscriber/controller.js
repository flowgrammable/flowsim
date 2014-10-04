
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
  console.log('login: ' + email);
  this.storage.getSubscriberByEmail(email, function(err, succ) {
    var token, expireTime;
    if(err) { 
      callback(err); 
    } else {
      if(bcrypt.compareSync(pwd, succ.password)) {
        token = uuid.v4();
        expireTime = new Date((new Date()).getTime() + defTimeout * 60000);
        that.storage.createSession(token, succ.id, expireTime.toISOString(),
          function(_err, _succ) {
            callback(_err, token);
        });
      } else {
        callback(msg.invalidPassword());
      }
    }
  });
};

Controller.prototype.logout = function(token, callback) {
  // if a valid session then delete the session
  console.log('logout: ' + token);
  this.storage.deleteSession(token, callback);
};

function controllerErrorHandler(method, subErr){
  var ctrlErr = {};
  ctrlErr.module = 'Subscriber';
  ctrlErr.component = 'Controller';
  ctrlErr.componentMethod = method;
  ctrlErr.subError = subErr;

  /**
   * Filter controller error to return friendly message to user
   * if(ctrlErr.componentMethod == 'register'){
   *   if(ctrlErr.subErr.componentMethod == 'createSubscriber'){
   *     if(ctrlErr.subErr.SubError.type == 'Unique Key Violation' 
   *         && ctrlErr.subErr.SubError.tableColumn == 'email' ){
   *           ctrlErr.userMessage = msg.EmailInUse();
   *     }
   *   }
   * }
   */
  return ctrlErr;
}

Controller.prototype.register = function(email, pwd, srcIp, callback) {
  var current, token, hash, that;
  current = new Date();
  token = uuid.v4();
  hash = bcrypt.hashSync(pwd, 10);
  that = this;
  // Create the subscriber entry and send the verification email
  this.storage.createSubscriber(email, hash, current.toISOString(), srcIp, 
                                token, function(err, succ) {
    var subject, body, e;
    if(err) {
      e = controllerErrorHandler('register', err);
      console.log(JSON.stringify(e));
      callback(e);
    } else {
      that.logger.info('Registered Subscriber: ' + email);
      subject = '';
      body = that.template.render('verification', {
        baseUrl: that.server.baseUrl(),
        token: token
      });
      that.mailer.send(email, subject, body);
      callback(null, msg.success() );
    }
  });
};

Controller.prototype.verify = function(token, callback) {
  // if the verification token is valid update
  // subscriber state
  // otherwise send an error
  console.log('verifying: ' + token);
  this.storage.verifySubscriber(token, callback);
};

Controller.prototype.forgot = function(email, callback) {
  // update the subscriber state and send and email
  // or send an error
  var token = uuid.v4();
  var that = this;
  console.log('forgot: ' + email);
  this.storage.resetSubscriber(email, token, function(err, succ) {
    var body, subject;
    if(err) {
      callback(err);
    } else {
      body = that.mailer.render('forgot', {
        baseUrl: that.server.baseUrl(),
        token: token
      });
      console.log('token: %s', token);
      that.mailer.send(email, subject, body, callback);
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

