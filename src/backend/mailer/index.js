var nodemailer = require("nodemailer");
var config = require('./config.js');
// function to send mail
exports.sendMail = function (email, message, next){

  var smtpTransport = nodemailer.createTransport("SMTP", config);
  var messageOptions = { from: 'flog mailer', to: email, subject: 'test', html: message}
  smtpTransport.sendMail(messageOptions, function(err, response){
    if(err){
      smtpTransport.close();
      next(err);
    }else{
      console.log("Message sent: " +  response.message);
      next(response);
    }
    smtpTransport.close();
  });      
}

exports.verificationMessage = function(token){
  var message = '<html><title>Thank you for signing up for Flowsim</title>'+
                 '<body>Thank you for signing up for Flowsim.<br/>Click the'+
                 ' link below to confirm your account<br/><br/><a href=\"'+
                 'http://localhost:3000/api/subscriber/verify/'+token+'\"'+
                 '>https://www.flowgrammable.org/subscriber/verify/'+token+
                 '</a><br/><br/><h1>The Flowsim Team!</h1></body></html>'
  return message;
}

