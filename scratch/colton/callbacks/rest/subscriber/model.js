var nodemailer = require("nodemailer");

var msg = require('./msg');

var subCreate = function(email, password, cb){

	var smtpTransport = nodemailer.createTransport("SMTP", {
           service: "Gmail",
           auth: {
               user: "flowgrammablemailer@gmail.com",
               pass: "" // insert password here
           }
    });

    var mailOptions = { from: "flog mailer", to: "coltonchojnacki@gmail.com", subject: "user registered", text: "just to have text"}

    smtpTransport.sendMail(mailOptions, function(err, response){
        if(err){
           smtpTransport.close();
           cb(msg.error(err.name));
        } else {
        	smtpTransport.close();
        	cb(msg.success('inserted user successfully'));
            console.log("Message sent: " + response.message);
        }
        
    });
}

var sendVerification = function(email, cb){

	var smtpTransport = nodemailer.createTransport("SMTP", {
           service: "Gmail",
           auth: {
               user: "flowgrammablemailer@gmail.com",
               pass: "" // insert password here
           }
    });

    var mailOptions = { from: "flog mailer", to: "coltonchojnacki@gmail.com", subject: "verification email sent", text: "just to have text"}

    smtpTransport.sendMail(mailOptions, function(err, response){
        if(err){
           smtpTransport.close();
           cb(err.name);
        } else {
        	cb(msg.success('send verification email is done'));
            console.log("Message sent: " + response.message);
        }
        smtpTransport.close();
    });
}


module.exports = function(){
	return {
		subscriber: {
			create: subCreate,
			sendVerification: sendVerification
		}
	}
}