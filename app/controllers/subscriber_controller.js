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

	req.models.subscriber.create({
	    email: req.body.email, // validated in app/models/subscriber.js
	    password: req.body.password, // validated in app/models/subscriber.js
	    reg_date: tmp,
	    reg_ip: req.body.ip
	}, function(err,subscriber){
	    if(err){
		console.log(err);
		switch(err.code){
		    case '23505': // orm error code for duplicate unique
			res.send('this email already registered\n');
			break;
		    default:
			if(err.msg){
			res.send(err.msg);
			} else { res.send('dont know what went wrong'); }
		}
	    } else {
		res.send('user registered sucessfully');
	    }
	});
    }	
}
