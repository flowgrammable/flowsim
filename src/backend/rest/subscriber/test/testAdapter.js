var uuid = require('node-uuid');
var bcrypt = require('bcrypt');

var msg = require('../msg');

var database = require('../../../database.js');
var Subscriber = database['subscribers'];
var Session = database['sessions'];
// var mailer = require('../../mailer');

Array.prototype.findSub = function(sub) {
  var hasId, hasEmail, hasVerToken, hasResetToken, found;
  if (sub.email) hasEmail = true;
  if (sub.verification_token) hasVerToken = true;
  if (sub.reset_token) hasResetToken = true;
	if (sub.id) hasId = true;

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
    if (hasResetToken) {
      if (this[i].reset_token == sub.reset_token) found = true;
      else continue;
    } 
    if (hasId){
			if (this[i].id == sub.id ) found = true;
      else continue;
    }
    if (found) return this[i];
  }
  return null;
}

Array.prototype.findSess = function(sessKey) {
  for (i in this) if (this[i].key == sessKey) return this[i];
  return null;
}

Array.prototype.deleteSess = function(session) {
  var success = false;
  for (i in this) 
    if (this[i] == session) {
      this.splice(i, 1);
      success = true;
    }
  return success;
}

// ----------------------------------------------------------------------------
// Subscriber

Array.prototype.containsEmail = function(email) {
  for (i in this) if (this[i].email == email) return true;
  return false;
}

function insertSubscriber(em, pwd, ip, cb) {
  var token = uuid.v4();
  var encrypted = bcrypt.hashSync(pwd, 10); 
  if (Subscriber.containsEmail(em)) cb(msg.emailInUse());
  else {
    var subToAdd = { 
      id: (Subscriber[Subscriber.length-1].id + 1),
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

function makeSubscriber(sub, cb) {
	Subscriber.push(sub);	
}

function fetchSubscriber(subInfo, cb) {
  var sub = Subscriber.findSub(subInfo);
  if (sub == null) cb(msg.subscriberNotFound());
  else cb(msg.success(sub));
}

// NO ERROR HANDLING
function updateSubscriber(sub, subInfo, cb) {
  if (subInfo.status)   sub.status = subInfo.status;
  if (subInfo.password) sub.password = subInfo.password;
  if (subInfo.email)    sub.email = subInfo.email;
  cb (msg.success(sub));
}

exports.insertSubscriber = insertSubscriber;
exports.fetchSubscriber = fetchSubscriber;
exports.makeSubscriber = makeSubscriber;
exports.updateSubscriber = updateSubscriber;


// ----------------------------------------------------------------------------
// Mailer
function sendVerificationEmail(em, cb){
    cb(msg.success());
}

function sendResetEmail(em, cb){
    cb(msg.success());
}

exports.sendVerificationEmail = sendVerificationEmail;
exports.sendResetEmail = sendResetEmail;


// ----------------------------------------------------------------------------
// Redirect
function verifyRedirect(cb) {
	var tunnel = {code:302,
								headers: {'Location':'http://localhost:3000/verified.html'}};
   cb(msg.success(null, tunnel));
}

exports.verifyRedirect = verifyRedirect;

// ----------------------------------------------------------------------------
// Session

function createSession(sub, cb) {
  var sessKey = uuid.v4();
  var newTimeout = new Date();
  newTimeout.setDate(newTimeout.getDate() + 1);
  var sessToAdd = { 
    subscriber_id: sub.id,
    key: sessKey,
    timeout: newTimeout
  };
  Session.push(sessToAdd);
  var newSess = Session[Session.length-1];
  if (newSess == sessToAdd) cb(msg.success(newSess.key)); // successful insert
  else cb(msg.unknownError(Session.pop()));
}

function fetchSession(sessKey, cb) {
  var sess = Session.findSess(sessKey);
  if (sess == null) cb(msg.sessionNotFound());
  else cb(msg.success(sess));
}

// This function is only called in the case that there is a valid 
// session found.
function destroySession(session, cb) {
  if (Session.deleteSess(session)) cb(msg.success());
  else cb(msg.unknownError);
}

exports.createSession = createSession;
exports.fetchSession = fetchSession;
exports.destroySession = destroySession;

