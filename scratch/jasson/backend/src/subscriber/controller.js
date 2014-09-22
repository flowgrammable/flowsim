
/**
 * @module subscriber
 */

(/** @lends module:subscriber */function(){

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

Controller.prototype.login = function(email, pwd, delgate) {
  // validate email/pwd
  // if good create a cression, return the token
  // else return error
  this.storage.createSession();
  delegate();
};

Controller.prototype.logout = function(delegate) {
  // if a valid session then delete the session
  this.storage.deleteSession();
  delegate();
};

Controller.prototype.register = function(delegate) {
  // create the subscriber, send a verification email
  // or return an error
  this.storage.createSubscriber();
  delegate();
};

Controller.prototype.verify = function(delegate) {
  // if the verification token is valid update
  // subscriber state
  // otherwise send an error
  this.storage.updateSubscriber();
  delegate();
};

Controller.prototype.reset = function(delegate) {
  // update the subscriber state and send and email
  // or send an error
  this.storage.updateSubscriber();
  delegate();
};

})();

