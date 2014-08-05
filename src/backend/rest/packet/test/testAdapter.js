var uuid = require('node-uuid');
var bcrypt = require('bcrypt');

var msg = require('../msg');

var database = require('../../../database.js');
var Subscriber = database['subscribers'];
var Packet = database['packets'];
var Session = database['sessions'];
// var mailer = require('../../mailer');

Array.prototype.findPack = function(sub_id) {
  var hasId, found;
	if (sub_id) hasId = true;

  for (i in this) {
    found = false;
    if (hasId){
			if (this[i].sub_id == sub_id ) found = true;
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

function createPacket(name, sub_id, cb) {
  var packetToAdd = {
    name: name,
    sub_id: sub_id
  };
  Packet.push(packetToAdd);
  var newPacket = Packet[Packet.length-1];
  if (newPacket == packetToAdd) cb(msg.success(newPacket));
  else cb(msg.unknownError(Packet.pop()));
}

function fetchPacket(sub_id, cb) {
  var pack = Packet.findPack(sub_id);
  if (pack == null) cb(msg.subscriberNotFound());
  else cb(msg.success(pack));
}

exports.insertSubscriber = insertSubscriber;
exports.fetchSubscriber = fetchSubscriber;

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

