
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

/*
 * register - register a new subscriber
 *
 *   - create a new subscriber row for the db
 *     -- use current date
 *     -- salt and hash the provided password
 *     -- generate a registration key to complete registration process
 *     -- set status as registered (not verified)
 *   - smtp msg containing registration key to provided email
 *
 *   sub - dictionary containing subscriber information
 *    .email    - email to use for the new subscriber
 *    .password - password chosen for new subscriber
 *    .ip       - source ip of registration request
 *
 *   models - object containing database models and database connection
 *
 *   callback - calback function upon db interaction
 *
 *   Error Types: user exists, db issue, crypto issue, bcrypt issue
 *
 */

exports.register = function(sub, models, callback) {
  var date = new Date();
  sub.reg_key = crypto.randomBytes(64).toString('hex');
  bcrypt.genSalt(10, function(err, salt) {
    if(err) throw err;  // not sure type of errors are possible here
    bcrypt.hash(sub.password, salt, function(err, hash) {
      var Subscriber = {
        email: sub.email,
        password: hash,
        reg_date: date,
        reg_ip: sub.ip,
        status: 'REGISTERED',
        status_date: date,
        reg_key: sub.reg_key
      };
      models.subscriber.create(Subscriber, function(err, results) {
        if(err) throw err; 
        callback(results);
      });
    });
  });
}

/*
 * verify - verify the account of a new subscriber
 *
 *   sub - dictionary containing subscriber information
 *    .email    - email to use for the new subscriber
 *    .reg_key  - registration key for validation
 *    .ip       - source ip of verification request
 *
 *   models - object containing database models and database connection
 *
 *   callback - calback function upon db interaction
 *
 *   Error Types: no user, bad reg key, db issue
 *
 */

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

/*
 * reset - reset the account of a subscriber
 *
 *   - assign a new password
 *   - smtp a msg containing new password to email of subscriber
 *
 *   sub - dictionary containing subscriber information
 *    .email    - email to use for the new subscriber
 *    .ip       - source ip of reset request
 *
 *   models - object containing database models and database connection
 *
 *   callback - calback function upon db interaction
 *
 *   Error Types: no user, db issue
 *
 */

exports.reset = function(sub, models, callback) {
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

/*
 * verify - verify the account of a new subscriber
 *
 *   sub - dictionary containing subscriber information
 *    .email    - email to use for the new subscriber
 *    .reg_key  - registration key for validation
 *    .ip       - source ip of verification request
 *
 *   models - object containing database models and database connection
 *
 *   callback - calback function upon db interaction
 *
 *   Error Types: no user, bad reg key, db issue
 *
 */

exports.login = function(sub, models, callback) {
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

/*
 * verify - verify the account of a new subscriber
 *
 *   sub - dictionary containing subscriber information
 *    .email    - email to use for the new subscriber
 *    .reg_key  - registration key for validation
 *    .ip       - source ip of verification request
 *
 *   models - object containing database models and database connection
 *
 *   callback - calback function upon db interaction
 *
 *   Error Types: no user, bad reg key, db issue
 *
 */

exports.logout = function(sub, models, callback) {
  var date = new Date();
  models.session.find({ key: sub.session_key }, function(err, results){
  });
}

