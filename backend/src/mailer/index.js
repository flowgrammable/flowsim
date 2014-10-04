
/**
 * @module mailer
 * @requires module:utils~Formatter
 */

(/** @lends module:mailer */function(){

var mailgun  = require('mailgun-js');
var fmt = require('../utils/formatter');

var name = 'mailer';

/**
 * Wraps a mailgun object
 *
 * @constructor
 * @param {Object} config        - a mailer configuration object
 * @param {Object} logger        - a logger object
 *
 */
function Mailer(config, logger) {
  // Grab a configuration if present ...
  // ... otherwise throw an error
  this.config = config[name];
  if(!this.config) {
    // FIXME: add a better error mechanism
    throw new Error('missing mailer config');
  }
  if(!this.config.apiKey){
    throw new Error('missing mailgun api key');
  }
  if(!this.config.domain){
    throw new Error('missing mailgun domain');
  }

  this.logger = logger.log.child({module: 'mailer'});
  this.mailer = mailgun({apiKey: this.config.apiKey, domain: this.config.domain});

}
exports.Mailer = Mailer;

function MailerError(method, err){
  var mailErr = {};
  mailErr.module = 'Mailer';
  mailErr.method = method;
  mailErr.subError = err;
  switch(err.statusCode){
    case '401':
      mailErr.description = 'Invalid mailgun credentials';
      mailErr.apiKey = Mailer.config.apiKey;
      mailErr.domain = Mailer.config.domain;
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
  this.mailer.messages().send(
    {
      from: this.config.user,
      to: dst,
      subject: sub,
      text: body
    }, function(err, body){
      if(err) {
        //that.logger.error(e); 
        callback(MailerError('send', err));
      } else {
        callback(null, body);
      }
  });

}; 

Mailer.prototype.toFormatter = function(f) {
  f.begin('Mailer');
  f.addPair('Server', this.config.service);
  f.addPair('User', this.config.user);
  f.end();
};

Mailer.prototype.toString = fmt.toString;

})();

