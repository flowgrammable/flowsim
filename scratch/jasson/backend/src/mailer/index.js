
var nm = require('nodemailer');

module.exports = function(cfg) {
  var name = 'mailer';

  // Grab a configuration if present ...
  // ... otherwise throw an error
  var config = cfg.get(name);
  if(!config) {
    // FIXME: add a better error mechanism
    throw 'Mailer missing config';
  }

  var transporter = nm.createTransport({
    service: config.service,
    auth: {
      user: config.user,
      pass: config.pwd
    }
  });

  function _close() {
    transporter.close();
  }
  
  function _mail(dst, sub, body) {
    transporter.sendMail({
      from: config.user,                    // set the smtp from
      to: dst,                              // set the smtp to
      subject: sub,                         // set the smtp subject
      html: body                            // set the smtp html-body
    }, function(err, info) {
      if(err) {
        console.log('Mailer error');
        console.log(err);
      } else {
        console.log('Mailer success');
        console.log(info);
      }
    });
  }

  function _toString() {
    return "";
  }

  function _toFormatter(f) {
    return f;
  }

  return {
    mail: _mail,
    close: _close,
    toString: _toString,
    toFormatter: _toFormatter
  };
};

