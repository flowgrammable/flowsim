var nodemailer = require("nodemailer");

/*
 * @module Mailer
 */

/*  Sends an email message
 *
 *  @method sendMessage
 *  @param {Object} config SMTP transport configuration Service, Username, Password
 *                  config = { service: 'Gmail', auth: { user: 'Gmail Username', pass: 'Gmail Password'}}
 *  @param {Object} messageOptions - from, to, subject, text
 */

exports.sendMessage = function(config, messageOptions, next){
	var smtpTransport = nodemailer.createTransport("SMTP", config);

	smtpTransport.sendMail(messageOptions, function(err, response){
	    if(err){
		smtpTransport.close();
		next(err.name);
	    }else{
		console.log("Message sent: " + response.message);
		}
		smtpTransport.close();
	});
}

