var nodemailer = require("nodemailer");

module.exports = function(config,mailOptions){
	var smtpTransport = nodemailer.createTransport("SMTP", config);

	smtpTransport.sendMail(mailOptions, function(err, response){
		if(err){
			console.log(err);
		}else{
			console.log("Message sent: " + response.message);
		}
		smtpTransport.close();
	});
}

