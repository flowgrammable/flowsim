
var orm = require('orm');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var settings = require('./config/settings');
var subscriber = require('./models/sub');

var registration_key = '';

function register(sub, models, callback) {
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

function verify(sub, models, callback) {
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

function reset(sub, models) {
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

function login(sub, models) {
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

function logout(sub, models) {
  var date = new Date();
  models.session.find({ key: sub.session_key }, function(err, results){
  });
}

orm.connect(settings.database, function(err, db) {
  if(err) throw err;
  console.log('connected to db');
  var models = subscriber.setup(db);

  var sub = {
    email: 'jasson@flowgrammable.com',
    password: '123',
    ip: '1.2.3.4'
  };

  register(sub, models, function(err, results) {
    if(err) throw err;
    console.log('success\n' + results);
  });

  var ver = {
    email: 'jasson@flowgrammable.com',
    reg_key: registration_key
  };

  console.log('global: %s', registration_key);

  verify(ver, models, function(err, results) {
    if(err) throw err;
    for (var i=0; i< results.length; ++i) {
      console.log(results[i].email);
      console.log(results[i].reg_key);
    }
  });

});
