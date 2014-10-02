
/**
 * @module mailer
 * @requires module:utils~Formatter
 */

(/** @lends module:mailer */function(){

var mailgun  = require('mailgun-js');
var fmt = require('../utils/formatter');

var name = 'mailer';

function Mailer(config, logger) {
  // Grab a configuration if present ...
  // ... otherwise throw an error
  this.config = config[name];
  if(!this.config) {
    // FIXME: add a better error mechanism
    throw 'Mailer missing config';
  }

  this.logger = logger.log.child({module: 'mailer'});
  this.mailer = mailgun({apiKey: this.config.apiKey, domain: this.config.domain});

}
exports.Mailer = Mailer;


Mailer.prototype.mail = function(dst, sub, body, callback) {
  var that = this;
  this.mailer.messages().send(
    {
      from: this.config.user,
      to: dst,
      subject: sub,
      text: body
    }, function(err, body){
      if(err) {
        that.logger.error(err);
        //console.log(err);           <----- once you employ bunyan ... no need to use console
        callback(err);
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

