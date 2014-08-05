var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
var msg = require('./msg');

var orm = require('../../dbbs');
var Subscriber = orm.model("subscriber");
var Packet = orm.model("packet");
var Session = orm.model("session");
var mailer = require('../../mailer');
var fs = require('fs');

// ----------------------------------------------------------------------------
// Packet

function createPacket(name, sub, cb) {
  packet.create({
    name: name,
    sub_id: sub.id
  }).success(function(result) {
    cb(msg.success(result));
  }).error(function(err) {
    if(err.detail == 'Key (email)=(' + em + ') already exists.')
      cb(msg.emailInUse());
    else
     cb(msg.unknownError(err));
  });
}

function fetchPacket(sub, cb) {
  Packet.find({ where: {sub_id: sub.id} })
    .success(function(result) {
      if (result == null) cb(msg.subscriberNotFound());
      else cb(msg.success(result));
    }).error(function(err) {
      cb(msg.unknownError(err)); // probably db connection error
    });
}

exports.createPacket = createPacket;
exports.fetchPacket = fetchPacket;

// ----------------------------------------------------------------------------
// Session

function createSession(sub, cb) {
  var sessKey = uuid.v4();
  var newTimeout = new Date();
  newTimeout.setDate(newTimeout.getDate() + 1);
  Session.create({
    key: sessKey,
    subscriber_id: sub.id,
    timeout: newTimeout.valueOf()
  }).success(function(result) {
    cb(msg.success(result.key));
  }).error(function(err) {
    console.log(err);
    cb(msg.unknownError(err));
  });
}

function fetchSession(sessKey, cb) {
  Session.find({ where: { key: sessKey } })
    .success(function(result) {
      if (result == null) cb(msg.sessionNotFound());
      else cb(msg.success(result));
    }).error(function(err) {
      cb(msg.unknownError(err)); // probably db connection error
    });
}

function destroySession(session, cb) {
  session.destroy()
    .success(function(result) {
      cb(msg.success());
    })
    .error(function(err) {
      console.log(err);
      cb(msg.unknownError(err));
    });
}

function clearTimeouts() {
  setInterval(function() { 
    var currTime = new Date().valueOf();
    Session.destroy({ timeout: { lt: currTime } })
      .success(function(result) { console.log("Rows deleted: " + result); })
      .error  (function(err)    { console.log(err); });
  }, 86400000 /* milliseconds in a day */ );
}

exports.createSession = createSession;
exports.fetchSession = fetchSession;
exports.destroySession = destroySession;
exports.clearTimeouts = clearTimeouts;
