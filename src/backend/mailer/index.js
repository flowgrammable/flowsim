var mailer = require("nodemailer");

// function to send mail
exports.sendMail = function (){
  var smtpTransport = nodemailer.createTransport("SMTP", config);
  smtpTransport.sendMail(messageOptions, function(err, response){
    if(err){
      smtpTransport.close();
      next(err.name);
    }else{
      console.log("Message sent: " +  response.message);
    }
    smtpTransport.close();
  });      
}

exports.verificationMessage = function(token){
  var message = '<html><title>Thank you for signing up for Flowsim</title>'+
                 '<body>Thank you for signing up for Flowsim.<br/>Click the'+
                 ' link below to confirm your account<br/><br/><a href=\"'+
                 'http://localhost:8000/api/subscribers/verify/'+token+'\"'+
                 '>https://www.flowgrammable.org/subscribers/verify/'+token+
                 '</a><br/><br/><h1>The Flowsim Team!</h1></body></html>'
  return message;
}
/*
var mailerConfig = {
              service:'gmail',
              auth:{
                user: 'flowgrammablemailer@gmail.com',
                pass: 'flowtester2014'
              }
            }

var messageOptions = {
              from: 'flog mailer',
              to: subscriber.email,
              subject: 'Verification Email',
              html:'<html><title>Thank you for signing up for Flowsim</title><body>' +
              'Thank you for signing up for Flowsim.<br/>Click the link below to confirm ' +
              'your account<br/><br/><a href=\"http://localhost:8000/api/subscribers/verify/'+
              token+'\">https://www.flowgrammable.org/subscribers/verify/'+token+'</a><br/>' +
              '<br/><h1>The Flowsim Team!</h1></body></html>'
            }
*/
