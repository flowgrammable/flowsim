#!/usr/bin/env node

var program = require('commander');
var mailer = require('./mailer');

//program
//  .version(process.env.SERVER_VERSION)
//  .option('-s, --service [email service]', 'Specify an email service')
//  .option('-u, --user [email user]', 'Specify an email username')
//  .option('-p, --pass [email pass]', 'Specify an email password')
//  .parse(process.argv);

var mailerConfig = { 
	service: 'gmail',
	auth: {
		user: 'flowgrammablemailer@gmail.com',
		pass: 'ddflogtester2014'
	      }
	}

var messageOptions = {
	from: "flog mailer", 
	to: "coltonchojnacki@gmail.com",
	subject: "test message",
	text: "This is a test message from mailer.js"
	}

mailer.sendMessage(mailerConfig, messageOptions, function(err){
	console.log(err);	
});

