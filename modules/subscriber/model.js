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
/*  status_date : { type: 'date', time: true },
    reg_key : { type: 'text', size: 64 }
*/
    }, {

    // validations for model       
    validations : {
        password : orm.enforce.ranges.length(8,16, "Password is not between 8-16 chars"),
        email : orm.enforce.patterns.email("Invalid Email")
      
    }, 

    hooks : {
        beforeSave: function (next) {
           var user = this;
            // hash password
            bcrypt.genSalt(10, function(err, salt) {
                if(err) throw err;
                bcrypt.hash(user.password, salt, function(err, hash){
                    if(err) return next(err);
                    user.password = hash;
                    next();
                });
            });

        }
        }
    });

  var Token = db.define('verification_token', {
    id : { type: 'integer', unique: true, defaultValue: undefined },
    sub_id : { type: 'integer', unique: true },
    token : { type: 'text', size: 36,  unique: true },
    created_at : { type: 'date', time: true }
	});
  
  Token.hasOne('subscriber', Subscriber);  
}
