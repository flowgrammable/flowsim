var uuid = require('node-uuid');
var bcrypt = require('bcrypt');

var msg = require('../msg');

var database = require('../../../database.js');
var Subscriber = database['subscribers'];
var Session = database['sessions'];
// var mailer = require('../../mailer');

// ----------------------------------------------------------------------------
// Subscriber

Array.prototype.containsEmail = function(email) {
  for (i in this) if (this[i].email == email) return true;
  return false;
}

function insertSubscriber(em, pwd, ip, cb){
  var token = uuid.v4();
  var encrypted = bcrypt.hashSync(pwd, 10); // encrypt the password
  if (Subscriber.containsEmail(em)) {
    cb(msg.emailInUse());
  } else {
    var subToAdd = {
      email: em,
      password: encrypted,
      reg_date: new Date(),
      reg_ip: ip, 
      verification_token: token,
      status: 'CREATED'
    };
    Subscriber.push(subToAdd);
    var newSub = Subscriber[Subscriber.length-1];
    if (newSub == subToAdd) {
      cb(msg.success(newSub));
    } else {
      cb(msg.unknownError(Subscriber.pop()));
    };
  }
}

// ----------------------------------------------------------------------------
// Mailer
function sendVerificationEmail(em, config, cb){
  if(config){
    cb(msg.success());
  } else {
    cb(msg.badConfig());
  }
}

exports.insertSubscriber = insertSubscriber;
exports.sendVerificationEmail = sendVerificationEmail;


