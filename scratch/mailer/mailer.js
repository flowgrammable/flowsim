var nodemailer = require("nodemailer");

module.exports = function(config,mailOptions, next){
	var smtpTransport = nodemailer.createTransport("SMTP", config);

	smtpTransport.sendMail(mailOptions, function(err, response){
		if(err){
			next(err);
		}else{
			console.log("Message sent: " + response.message);
		}
		smtpTransport.close();
	});
}

