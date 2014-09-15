
var nm = require('nodemailer');
var ejs = require('ejs');
var fs = require('fs');

module.exports = function(srv, sub, pwd) {
  var transporter = nm.createTransport({
    service: srv,
    auth: {
      user: sub,
      pass: pwd
    }
  });
  return {
    render: function(filename, ctx) {
      return ejs.render(fs.readFileSync(filename, 'utf8'), ctx);
    },
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

