#!/usr/bin/env node

var program = require('commander');
var sendMail = require('./mailer');

program
  .version(process.env.SERVER_VERSION)
  .option('-s, --service [email service]', 'Specify an email service')
  .option('-u, --user [email user]', 'Specify an email username')
  .option('-p, --pass [email pass]', 'Specify an email password')
  .parse(process.argv);

var mailerConfig = { 
	service: program.service,
	auth: {
		user: program.user,
		pass: program.pass
	}
	}

console.log(mailerConfig);
var mailOptions = {
	from: "flog mailer", 
	to: "coltonchojnacki@gmail.com",
	subject: "test message",
	text: "This is a test message from mailer.js"
	}

sendMail(mailerConfig, mailOptions);

