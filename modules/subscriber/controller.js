var enforce = require('enforce');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var mailer = require("../mailer");

module.exports = 
{
    read: function(req, res, next) {
		res.send('a list of subscribers');
    },

    create: function(req, res, next) {
    	var date = new Date();           // Set registration date when 
		var tmp = date.toISOString();    // posts to resource
        var checks  = new enforce.Enforce();
        checks.add("password1",enforce.ranges.length(8,16, "Password is not between 8-16 chars"));
        checks.add("password2",enforce.sameAs("password1", "Passwords do not match"));
        checks.add("email",enforce.patterns.email("Invalid Email"));
        checks.check({
            email: req.body.email,
            password1: req.body.password1,
            password2: req.body.password2
        }, function(err) {
            if(err)
            {
                res.writeHead("400", {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error:err.msg}));
            }
            else {
	            req.models.subscriber.create({
	                email: req.body.email, // validated in app/models/subscriber.js
	                password: req.body.password1, // validated in app/models/subscriber.js
	                reg_date: tmp,
	                reg_ip: req.connection.remoteAddress
	            }, function(err,subscriber){
	                if(err){
		                switch(err.code){
		                    case '23505': // orm error code for duplicate unique
	                                res.writeHead("409", {'Content-Type': 'application/json'});
				        res.end(JSON.stringify({message:"User with that email is already registered"}));
			                break;
		                    default:
                                	res.end('dont know what went wrong'); 
		                }
	                } else {
                        res.writeHead("201", {'Content-Type': 'application/json'});
		    			res.end(JSON.stringify({message:'user registered sucessfully'}));
	                	// 1. generate token
                        var token = uuid.v1();
	               		// 2. store token in verification_token table
                            // 2a. associated token with registered user
                            // 2b. store token creation date
                        req.models.verification_token.create({
                            sub_id: subscriber.id,
                            token: token,
                            created_at: new Date() 
                        }, function(err,ver_token){
                            if(err){
                                //Error storing content in database
                                //res.writeHead("400", {'Content-Type': 'application/json'});
                                //res.end(JSON.stringify({error:err.msg}));
                                console.log(err.msg);
                            }
                            else {
                                console.log("Token created successfully");
                            }
                        });
		        		//send email containing token link
                        var mailerConfig = {
                            service:'gmail',auth:{user: 'flowgrammablemailer@gmail.com', pass: 'flowtester'}
                        }   

                        var messageOptions = {
                            from: "flog mailer", to: subscriber.email, subject: "Verification Email", text: "Please verify you email-address by clicking at the below link:", html:"<html><title>Thank you for signing up for Flowsim</title><body>Thank you for signing up for Flowsim.<br/>Click the link below to confirm your account<br/><br/><a href=\"https://localhost:8000/subscribers/verify/"+token+"\">https://www.flowgrammable.org/subscribers/verify/"+token+"</a><br/><br/><h1>The Flowsim Team!</h1></body></html>"
                        }
                        mailer.sendMessage(mailerConfig, messageOptions, function(err){ 
                            console.log(err);//--> HTTP error code??? Some problem with sending email?-->Either invalid inactive email address or not Internet connection available?
                        }); 
	                }
	            });
            }
        });
    },

    verify: function(req, res, next) {
        // 1. get token from url
        var token_id = req.params.token;        
				// 2. find token in database
        req.models.verification_token.find({
            token:token_id
        }, function(err, token){
			// 3. set user associated with token to VERIFIED STATUS
            // 4. respond with 'email verified' or 404 for invalid token
            if(err || token.length==0) {
                res.writeHead("404", {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error:'Invalid token'}));
            }
            else {
                //if more than 1 =  error!!(Might be hash collision)
                if(token.length > 1)
                {
                    res.writeHead("500", {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error:'Internal Service Error'}));
                }
                var id = token[0].sub_id;
                req.models.subscriber.get(id,function(err,subscriber){
                    if(err) {
                        //No user of this id has registerd
                        res.writeHead("404", {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({error:'Invalid token'}));
                    }
                    else {
                        subscriber.status = 'VERIFIED';
                        subscriber.save(function(err) {
                            if(err) {
                            	//Error saving to the database
                                res.writeHead("500", {'Content-Type': 'application/json'});
                                res.end(JSON.stringify({error:'Internal Service Error'}));
                            }
                            else {
                                console.log("Saved successfully");
                                res.writeHead("302", {'Content-Type': 'application/json', 'Location': '/#signin'});
                                res.end(JSON.stringify({message:'email verification successful'}));
                            }
                        });
                    }
                });
            }
        });
    }
}   
