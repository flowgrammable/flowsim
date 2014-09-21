
/**
 * @module mailer
 */

(/** @lends module:mailer */function(){

var nm  = require('nodemailer');
var fmt = require('../utils/formatter');

var name = 'mailer';

/**
 * Provides SMTP services.
 *
 * @constructor
 * @param {config} config - a global configuration object
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
 * Close the open SMTP transport resources.
 *
 * @memberof mailer.Mailer
 * @method close
 */
Mailer.prototype.close = function() {
  this.transporter.close();
};

/**
 * Send a mail to a valid email destination.
 *
 * @memberof Mailer
 * @method mail
 */
Mailer.prototype.mail = function(dst, sub, body, delegate) {
  transporter.sendMail({
    from: this.config.user,   // set the smtp from
    to: dst,                  // set the smtp to
    subject: sub,             // set the smtp subject
    html: body                // set the smtp html-body
  }, function(err, info) {
    if(delegate && err) {
      delegate(err);
    } else if(delegate && info) {
      delegate(info);
    } else if(err) {
      //FIXME: this needs to be something better than console
      console.log(err);
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

