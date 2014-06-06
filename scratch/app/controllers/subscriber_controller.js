var bcrypt = require('bcrypt');

module.exports = 
{
    list: function(req, res, next) {
        req.models.subscriber.find({status: 'REGISTER'}, function(err, subs){
            res.end('getting subscribers');
	    });
    },

    create: function(req, res, next) {
        var date = new Date();           // Set registration date when 
	    var tmp = date.toISOString();    // posts to resource
        if(req.body.password1 != req.body.password2) {
            res.status("400");
            res.send({error:"Password Mismatch"});
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
                            res.status("409");
			                res.send({message:"User with that email is already registered"});
			                break;
		                default:
			                if(err.type=="validation"){
			                    res.status("400");
                                res.send({error:err.msg});
			                } else { 
                                res.send('dont know what went wrong'); 
                            }
		            }
	            } else {
                    res.status("201");
		            res.send({message:'user registered sucessfully'});
	            }
	        });
        }
    }	
}
