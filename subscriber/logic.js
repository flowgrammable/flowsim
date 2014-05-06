
var crypto = require('crypto');   // use crypto for generating random strings
var bcrypt = require('bcrypt');   // use to provide password (salt+hashing)

/* Basic signature for exposing a logic function
 *
 * exports.<name> = function(<dict>, subscribers, callback) {
 *   ...
 * }
 *
 * exports.<name> - ensures this function can be used externally
 * <dict>         - dictionary of function parameters
 * subscribers    - orm database connection defining subscribers model
 * callback       - function to handle success/failure of operation
 *
 */

exports.register = function(sub, models, callback) {
  var date = new Date();
  sub.reg_key = crypto.randomBytes(64).toString('hex');
  registration_key = sub.reg_key;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(sub.password, salt, function(err, hash) {
      var Subscriber = {
        email: sub.email,
        password: hash,
        reg_date: date,
        reg_ip: sub.ip,
        status_date: date,
        reg_key: sub.reg_key
      };
      models.subscriber.create(Subscriber, callback);
    });
  });
}

exports.verify = function(sub, models, callback) {
  var date = new Date();
  models.subscriber.find(
    { 
      email: sub.email,
      status: 'REGISTERED',
      reg_key: sub.reg_key
    }, function(err, results){
      if(err) throw err;
      if(results.length == 1) {
        results[0].status = 'VERIFIED';
        results[0].status_date = date;
        results[0].save(function(err) {
          if(err) throw err;
        });
      }
    });
}

exports.reset = function(sub, models) {
  var date = new Date();
  sub.password = crypto.randomBytes(30).toString('hex');
  models.subscriber.find({ email: sub.email },
    function(err, results) {
      if(results.length == 1) {
        results[0].status_date = date;
        results[0].password = sub.password;
        results[0].save(function(err) {
          if(err) throw err;
        });
        // smtp email with password reset link
      }
    });
}

exports.login = function(sub, models) {
  var date = new Date();
  sub.session_key = crypto.randomBytes(64).toString('hex');
  models.subscriber.find({ email: sub.email},
    function(err, results) {
      if(results.length == 1) {
        bcrypt.compare(
          sub.password, 
          results[0].password, 
          function(err, res) {
            if(res) {
            }
          });
      }
    });
}

exports.logout = function(sub, models) {
  var date = new Date();
  models.session.find({ key: sub.session_key }, function(err, results){
  });
}

