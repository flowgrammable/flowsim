var msg = require('./msg');

var orm = require('../../dbbs');
var Packet = orm.model("packet");
// ----------------------------------------------------------------------------
// Packet

function createPacket(sub_id, name, cb) {
  Packet.create({
    name: name,
    subscriber_id: sub_id
  }).success(function(result) {
    cb(msg.success(result));
  }).error(function(err) {
     cb(msg.unknownError(err));
  });
}

function fetchPacket(packetInfo, cb) {
  Packet.find({ where: packetInfo })
    .success(function(result) {
      if (result == null) cb(msg.noPacketFound());
      else cb(msg.success(result));
    }).error(function(err) {
      cb(msg.unknownError(err)); 
    });
}

function listPackets(sub_id, cb) {
  Packet.findAll({ where: {subscriber_id: sub_id} })
    .success(function(result) {
      if (result == null) cb(msg.noPacketsFound());
      else cb(msg.success(result));
    }).error(function(err) {
      cb(msg.unknownError(err)); 
    });
}

function updatePacket(packet, newPacketInfo, cb) {
  Packet.updateAttributes(newPacketInfo)
    .success(function(result) { cb(msg.success(result)); })
    .error  (function(err)    { cb(msg.unknownError(err)); });
}

function destroyPacket(packet, cb) {
  Packet.destroy()
    .success(function(result) { cb(msg.success()); })
    .error  (function(err)    { cb(msg.unknownError(err)); });
}

exports.createPacket = createPacket;
exports.fetchPacket = fetchPacket;
exports.listPackets   = listPackets;
exports.updatePacket  = updatePacket;
exports.destroyPacket = destroyPacket;

