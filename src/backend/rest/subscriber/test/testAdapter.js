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

Array.prototype.find = function(sub) {
  var hasEmail, hasVerToken, found;
  if (sub.email) hasEmail = true;
  if (sub.verification_token) hasVerToken = true;
  for (i in this) {
    found = false;
    if (hasEmail) {
      if (this[i].email == sub.email) found = true;
      else continue;
    }
    if (hasVerToken) {
      if (this[i].verification_token == sub.verification_token) found = true;
      else continue;
    }
    if (found) return this[i];
  }
  return null;
}

function insertSubscriber(em, pwd, ip, cb){
  var token = uuid.v4();
  var encrypted = bcrypt.hashSync(pwd, 10); 
  if (Subscriber.containsEmail(em)) cb(msg.emailInUse());
  else {
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
    if (newSub == subToAdd) cb(msg.success(newSub));
    else cb(msg.unknownError(Subscriber.pop()));
  }
}

function fetchSubscriber(subInfo, cb){
  var sub = Subscriber.find(subInfo);
  if (sub == null) cb(msg.subscriberNotFound());
  else cb(msg.success(sub));
}

function verifySubscriber(sub, cb){
  if (sub.status == 'ACTIVE') cb(msg.subscriberAlreadyVerified());
  else {
    sub.status = 'ACTIVE';
    cb(msg.success(sub));
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


// ----------------------------------------------------------------------------
// Redirect
function verifyRedirect(cb){
	var tunnel = {code:302,
								headers: {'Location':'http://localhost:3000/verified.html'}};
   cb(msg.success(null, tunnel));
}
exports.insertSubscriber = insertSubscriber;
exports.fetchSubscriber = fetchSubscriber;
exports.verifySubscriber = verifySubscriber;
exports.sendVerificationEmail = sendVerificationEmail;
exports.verifyRedirect = verifyRedirect;

