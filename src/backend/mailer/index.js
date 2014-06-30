var mailer = require("nodemailer");

// function to send mail
exports.sendMail = function (){
       
}

exports.verificationMessage = function(token){
   
   var message = '<html>Thanks for signing up'+token;
        return message;
}
