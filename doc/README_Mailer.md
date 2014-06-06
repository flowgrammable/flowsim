
## 1. Import Mailer Module

var mailer = require('./mailer');

## 2. Configure SMTP service credentials 

'''
var mailerConfig = { 
	service: 'gmail',
	auth: {
		user: 'flowgrammablemailer@gmail.com',
		pass: 'ddflogtester2014'
	      }
	}
'''

## 3. Configure email message options

'''
var messageOptions = {
	from: "flog mailer", 
	to: "coltonchojnacki@gmail.com",
	subject: "test message",
	text: "This is a test message from mailer.js",
        html: "<b> you can send html also </b>"
	}

'''

## 4. Send message with following:

'''
mailer.sendMessage(mailerConfig, messageOptions, function(err){
	console.log(err);	
});
'''
