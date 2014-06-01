var bcrypt = require('bcrypt');

module.exports = {
    list: function(req, res, next) {
        req.models.subscriber.find({status: 'REGISTER'}, function(err, subs){
            res.end('getting subscribers');
	});
    },

    create: function(req, res, next) {
        var date = new Date();           // Set registration date when 
	var tmp = date.toISOString();    // posts to resource

        ///need to add password validation here

	bcrypt.genSalt(10, function(err, salt ) {   // generate salt
	    if(err) throw err;
	    bcrypt.hash(req.body.password , salt, function(err, hash) {  // hash password
		if(err) throw err;
		req.models.subscriber.create({
		    email: req.body.email, // validated in user model
		    password: hash,
		    reg_date: tmp,
		    reg_ip: req.body.ip
		}, function(err,subscriber){
		    if(err){
		        switch(err.code){
			    case '23505': // orm error code for duplicate unique
			    res.send('this email already registered\n');
			    break;
			default:
			    res.send('dont know what went wrong');
			}
		    } else {
		        res.send('user registered sucessfully');
		    }
		    });
	    });
	});
    }	
}
