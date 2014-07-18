var uuid = require('node-uuid');
var bcrypt = require('bcrypt');

var msg = require('../msg');

var database = require('../../../database.js');
var Subscriber = database['subscribers'];
var Session = database['sessions'];
// var mailer = require('../../mailer');

Array.prototype.findSub = function(sub) {
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

// ----------------------------------------------------------------------------
// Subscriber

Array.prototype.containsEmail = function(email) {
  for (i in this) if (this[i].email == email) return true;
  return false;
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

function makeSubscriber(sub, cb){
	Subscriber.push(sub);	
}

function fetchSubscriber(subInfo, cb){
  var sub = Subscriber.findSub(subInfo);
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

exports.insertSubscriber = insertSubscriber;
exports.fetchSubscriber = fetchSubscriber;
exports.verifySubscriber = verifySubscriber;
exports.makeSubscriber = makeSubscriber;
// ----------------------------------------------------------------------------
// Mailer
function sendVerificationEmail(em, config, cb){
  if(config){
    cb(msg.success());
  } else {
    cb(msg.badConfig());
  }
}

exports.sendVerificationEmail = sendVerificationEmail;

// ----------------------------------------------------------------------------
// Redirect
function verifyRedirect(cb){
	var tunnel = {code:302,
								headers: {'Location':'http://localhost:3000/verified.html'}};
   cb(msg.success(null, tunnel));
}

exports.verifyRedirect = verifyRedirect;

// ----------------------------------------------------------------------------
// Session

function createSession(subId, cb){
  var sessKey = uuid.v4();
  var sessToAdd = { 
    subscriber_id: subId,
    key: sessKey
    // begin_time: new Date(),
    // timeout: blah,
    // ip: ip  
  };
  Session.push(sessToAdd);
  var newSess = Session[Session.length-1];
  if (newSess == sessToAdd) cb(msg.success(newSess.key)); // successful insert
  else cb(msg.unknownError(Session.pop()));
}

exports.createSession = createSession;
