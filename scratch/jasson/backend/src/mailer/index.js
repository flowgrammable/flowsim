
/**
 * @module mailer
 * @requires module:utils~Formatter
 */

(/** @lends module:mailer */function(){

var nm  = require('nodemailer');
var fmt = require('../utils/formatter');

var name = 'mailer';

/**
 * Provides mail service that wraps the nodemailer library. This object creates
 * a pool of resources that are connected to the mail service. These connections
 * are only closed when the object is destroyed or if close is explicitly 
 * called.
 *
 * @constructor
 * @param {Object} config         - a mail configuration object
 * @param {String} config.service - name of the mail service provider
 * @param {String} config.user    - email to use for the mail service
 * @param {String} config.pwd     - passwod to use for the mail service
 */
function Mailer(config) {

  // Grab a configuration if present ...
  // ... otherwise throw an error
  this.config = config[name];
  if(!this.config) {
    // FIXME: add a better error mechanism
    throw 'Mailer missing config';
  }

  // initialize the nodemailer transporter
  this.transporter = nm.createTransport({
    service: config.service,
    auth: {
      user: config.user,
      pass: config.pwd
    }
  });

}
exports.Mailer = Mailer;

/**
 * Close the connection resources associated with this object.
 *
 * @returns {Mailer}
 */
Mailer.prototype.close = function() {
  this.transporter.close();
  return this;
};

/**
 * @callback mailCallback
 * @param {Object} one - blah
 * @param {Object} two - blah
 */

/**
 * Sends an email to the indicated recipient using the provided
 * subject and body. The sender address set using the email user
 * provided during object construction.
 *
 * @param {String} dst            - email address
 * @param {String} sub            - email subject line
 * @param {String} body           - email message body
 * @param {mailCallback} delegate -
 * @returns {Mailer}
 *
 */
Mailer.prototype.mail = function(dst, sub, body, callback) {
  this.transporter.sendMail({
    from: this.config.user,   // set the smtp from
    to: dst,                  // set the smtp to
    subject: sub,             // set the smtp subject
    html: body                // set the smtp html-body
  }, callback);
}; 

Mailer.prototype.toFormatter = function(f) {
  f.begin('Mailer');
  f.addPair('Server', this.config.service);
  f.addPair('User', this.config.user);
  f.end();
};

Mailer.prototype.toString = fmt.toString;

})();

