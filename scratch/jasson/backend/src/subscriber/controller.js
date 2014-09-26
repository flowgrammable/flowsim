
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
  // validate email/pwd
  // if good create a cression, return the token
  // else return error
  this.storage.getSubscriberByEmail(email, function(err, result) {
    if(err) {
      callback(err);
    } else if(bcrypt.compareSync(pwd, result[0].password)) {
      this.storage.createSession(uuid.v4(), id, timeout, callback);
    } else {
    }
  });
  this.storage.createSession(uuid.v4(), id, timeout, callback);
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

