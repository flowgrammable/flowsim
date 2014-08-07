var msg = require('../msg');
var database = require('../../../database.js');
var Packet = database['packets'];

Array.prototype.findPack = function(sub_id) {
  var found = false;
  var packets = Array();
  for (i in Packet) {
		if (this[i].subscriber_id == sub_id ) {
      packets[packets.length] = this[i];
      found = true;
    }
    else continue;  
  }
  if (found) return packets;
  return null;
}

// ----------------------------------------------------------------------------
// Packet

function createPacket(name, sub_id, cb) {
  var packetToAdd = {
    name: name,
    subscriber_id: sub_id
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

exports.createPacket = createPacket;
exports.fetchPacket = fetchPacket;
