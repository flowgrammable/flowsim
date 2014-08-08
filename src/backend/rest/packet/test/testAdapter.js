var msg = require('../msg');
var database = require('../../../database.js');
var Packet = database['packets'];

Array.prototype.findPacket = function(packetInfo) {
  var hasId, hasSubId, hasName, found;
  if (packetInfo.id) hasId = true;
  if (packetInfo.subscriber_id) hasSubId = true;
  if (packetInfo.name) hasName = true;
  for (i in this) {
    found = false;
    if (hasId) {
      if (this[i].id == packetInfo.id) found = true;
      else continue;
    }
    if (hasSubId) {
      if (this[i].subscriber_id == packetInfo.subscriber_id) found = true;
      else continue;
    }
    if (hasName) {
      if (this[i].name == packetInfo.name) found = true;
      else continue;
    }
    if (found) return this[i];
  }
  return null;
}

Array.prototype.deletePacket = function(packet) {
  var success = false;
  for (i in this)
    if (this[i] == packet) {
      this.splice(i, 1);
      success = true;
    }
  return success;
}
// ----------------------------------------------------------------------------
// Packet

function createPacket(sub_id, name, cb) {
  var packetToAdd = {
    id: (Packet[Packet.length-1].id + 1),
    name: name,
    subscriber_id: sub_id
  };
  Packet.push(packetToAdd);
  var newPacket = Packet[Packet.length-1];
  if (newPacket == packetToAdd) cb(msg.success(newPacket));
  else cb(msg.unknownError(Packet.pop()));
}

function fetchPacket(packetInfo, cb) {
  var pack = Packet.findPacket(packetInfo);
  if (pack == null) cb(msg.packetNotFound());
  else cb(msg.success(pack));
}

function updatePacket(packet, packetInfo, cb) {
  if (packetInfo.name) packet.name = packetInfo.name;
  cb (msg.success(packet));
}

function destroyPacket(packet, cb) {
  if (Packet.deletePacket(packet)) cb(msg.success());
  else cb(msg.unknownError);
}

function listPackets(subId, cb) {
  var list = new Array();
  for (i in Packet)
    if (Packet[i].subscriber_id == subId)
      list[i] = Packet[i];
  cb(msg.success(list));
}

function makePacket(packet, cb) {
  Profile.push(packet);
}

exports.createPacket = createPacket;
exports.fetchPacket = fetchPacket;
exports.listPackets   = listPackets;
exports.updatePacket  = updatePacket;
exports.destroyPacket = destroyPacket;
exports.makePacket    = makePacket;

