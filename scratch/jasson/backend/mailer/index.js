
var nm = require('nodemailer');

module.exports = function(config) {

  var name = 'mailer';
  var cfg = config.get(name);

  if(!name) throw 'Mailer missing config';

  var transporter = nm.createTransport({
    service: cfg.service,
    auth: {
      user: cfg.user,
      pass: cfg.pwd
    }
  });

  function _close() {
    transporter.close();
  }
  
  function _mail(src, dst, sub, body) {
    transporter.sendMail({
      from: src,                            // set the smtp from
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

  return {
    mail: _mail,
    close: _close
  };
};

