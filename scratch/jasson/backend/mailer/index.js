
var nm = require('nodemailer');

module.exports = function(config) {
  var transporter = nm.createTransport({
    server: config.service,
    auth: {
      user: config.user,
      pass: config.pwd
    }
  });
  return {
    close: function() {
      transporter.close();
    },
    mail: function(src, dst, sub, body) {
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
  };
};

