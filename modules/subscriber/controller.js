var bcrypt = require('bcrypt');
module.exports = 
{
    read: function(req, res, next) {
	res.send('a list of subscribers');
    },

    create: function(req, res, next) {
      var date = new Date();           // Set registration date when 
	    var tmp = date.toISOString();    // posts to resource
        if(req.body.password1 != req.body.password2) {

            res.writeHead("400", {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error:"Password Mismatch"}));
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
			                if(err.type=="validation"){
			                    res.writeHead("400", {'Content-Type': 'application/json'});
                          res.end(JSON.stringify({error:err.msg}));
			                } else { 
                                res.end('dont know what went wrong'); 
                            }
		            }
	            } else {
                  res.writeHead("201", {'Content-Type': 'application/json'});
		    					res.end(JSON.stringify({message:'user registered sucessfully'}));
		    // 1. generate token
		    // 2. store token in verification_token table
                    // 2a. associated token with registered user
                    // 2b. store token creation date
		    //send email containing token link
	            }
	        });
        }
    },

    verify: function(req, res, next) {
            // 1. get token from url
            // 2. find token in database
            // 3. set user associated with token to VERIFIED STATUS
            // 4. respond with 'email verified' or 404 for invalid token
    }	
}
