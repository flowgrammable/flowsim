
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
  models.subscriber.find(
    { and: [
      { email: sub.email },
      { status: 'REGISTERED' },
      { reg_key: sub.req_key }
    ]}, callback);
}

function reset(email) {
}

function deactivate(email, session_key) {
  var date = new Date();
}

function login(sub) {
  var date = new Date();
  sub.session_key = crypto.randomBytes(64).toString('hex');
  bcrypt.compare(sub.password, hash, function(err, res) {
  });
  // sub { email, password, ip }
}

function logout(email, session_key) {
  var date = new Date();
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
    reg_key: registration_key + '1'
  };

  verify(ver, models, function(err, results) {
    if(err) throw err;
    for (var result in results) {
      console.log(result);
    }
  });

});
