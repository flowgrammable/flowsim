var bcrypt = require('bcrypt');
var validator = require('validator');

module.exports = function (db,orm) {
  var Subscriber = db.define('subscriber', {
	id : { type: 'integer', unique: true, defaultValue: undefined },
	email : { type: 'text', size: 128, unique: true },
	password : { type: 'text', size: 60 },
	reg_date : { type: 'date', time: true },
	reg_ip : { type: 'text', size: 128 },
	status : {
		type: 'enum',
		values : [ 'REGISTERED', 'VERIFIED'],
		defaultValue: 'REGISTERED'
	}
/*	status_date : { type: 'date', time: true },
	reg_key : { type: 'text', size: 64 }
*/
	}, {

	// validations for model	   
	validations : {
		password : orm.enforce.ranges.length(8,16, "invalid length")
		// need to move validator.isEmail(email) here
	}, 
	
	hooks : {
		beforeSave: function (next) {
		   var user = this;
		   
		   if (validator.isEmail(user.email)) {
			// hash password
			bcrypt.genSalt(10, function(err, salt) {
			if(err) throw err;
			    bcrypt.hash(user.password, salt, function(err, hash){
				if(err) return next(err);
				user.password = hash;
				next();
			    });
			});
			
		   } else {
		        return next(new Error("invalid email"));
		   }
		}
	    }
	});

}
