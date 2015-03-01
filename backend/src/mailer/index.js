
/**
 * @module mailer
 * @requires module:utils~Formatter
 */

(/** @lends module:mailer */function(){

var fmt = require('../utils/formatter');
var sendgrid = require('sendgrid');
var name = 'mailer';
var s = require('./storage.js');

/**
 * Wraps a mailgun object
 *
 * @constructor
 * @param {Object} config        - a mailer configuration object
 * @param {Object} logger        - a logger object
 *
 */
function Mailer(config, logger, db) {
  // Grab a configuration if present ...
  // ... otherwise throw an error
  this.config = config[name];
  if(!this.config) {
    throw new Error('Mailer: missing config');
  }
  if(!this.config.api_user){
    throw new Error('Mailer: missing config.api_user');
  }
  if(!this.config.api_password){
    throw new Error('Mailer: missing config.api_password');
  }
  if(!this.config.domain){
    throw new Error('Mailer: missing config.domain');
  }
  if(!this.config.user){
    throw new Error('Mailer: missing config.user');
  }

  this.logger = logger.addLog(name);
  this.storage = new s.Storage(db, this.logger);

  // construct the mailer
  this.mailer = sendgrid(this.config.api_user, this.config.api_password);

}
exports.Mailer = Mailer;

function MailerError(method, err, config){
  var mailErr = {};
  mailErr.module = 'Mailer';
  mailErr.method = method;
  mailErr.subError = err;
  mailErr.mailConfig = config;
  switch(err.statusCode.toString()){
    case '401':
      mailErr.description = 'InvalidMailgunCredentials';
      break;
    default:
      mailErr.description = 'Unknown Error';
      break;
  }
  return mailErr;
}

/**
 * Take a subscriber email address, subject, and body
 * and send message
 *
 * @param {String} dst               - subscriber email address
 * @param {String} sub               - email subject
 * @param {String} body              - email body
 * @param {genericCallback} callback - a generic callback for mail results
 *
 */
Mailer.prototype.send = function(dst, sub, body, callback) {
  var that = this;
  var e;
  var logString = sub + ' message sent to: ' + dst;
  this.mailer.send({
    to: dst,
    from: this.config.user,
    subject: sub,
    html: body
  }, function(err, json){
    if(err){
      that.logger.error(err);
      callback(err);
    } else {
      that.logger.info(json);
      callback(null, json);
    }
  });
};

/**
 * Take a first name, last name, email address, company (optional), and
 * subscriber_id (optional) and subscribe them to mailing list;
 *
 * @param {String} fname - subscriber firstname
 * @param {String} lname - subscriber lastname
 * @param {String} email - subscriber email
 * @param {String} company - optional
 * @param {Integer} id - subscriber id
 *
 */
Mailer.prototype.subscribe = function(fname, lname, email, company, id, 
    callback) {
  var that, subToken, logString;
  that = this;
  subToken = uuid.v4();
  logString = 'Subscription Active: ' + email;
  this.storage.insertMailerSubscriber(fname, lname, email, company,
      subToken, function(err, result){
        if(err){
          e = MailerError('subscribe', err, that.config);
          that.logger.error(e);
        } else {
          that.logger.info(logString);
        }
  });

  // then add user to mailgun mailer list
};

/**
 * Take a token and unsubscribe user
 *
 * @param {String} token - clickable 'Unsubscribe' token in email
 *
 */
Mailer.prototype.unsubscribe = function(token, callback){
  var that, logString;
  that = this;
  this.storage.setSubInactive(token, function(err, result){
    if(err){
      e = MailerError('unsubscribe', err, that.config);
      that.logger.error(e);
    } else {
      that.logger.info(logString);
    }
  });

  // then remove user from mailgun mailing list
};

Mailer.prototype.toFormatter = function(f) {
  f.begin('Mailer');
  f.addPair('domain', this.config.domain);
  f.addPair('User', this.config.user);
  f.end();
};

Mailer.prototype.toString = fmt.toString;

})();
