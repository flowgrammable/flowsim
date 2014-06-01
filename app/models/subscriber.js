var validator = require('validator');

module.exports = function (orm, db) {
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
	    
	
	   
	    hooks : {
		beforeSave: function (next) {
			console.log(this.email);
		   if (validator.isEmail(this.email)) {
			return next();
		   } else {
		        return next(new Error("invalid email"));
		   }
		}
	    }
	});

}
