var msg = require('./msg');

var orm = require('../../dbbs');
var Packet = orm.model("packet");
// ----------------------------------------------------------------------------
// Packet

/*
 * The createPacket function creates and makes a database insert 
 * for the packet and any related table entries whose fields can 
 * be inferred based on the ofp_version
 */
  
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

/*
 * The fetchPacket function fetches a single packet from the 
 * database based on the packet_ID. If successful, a success message
 * containing the fetched packet is returned otherwise msg.noPacketFound 
 * is returned. 
 */

function fetchPacket(packetInfo, cb) {
  Packet.find({ where: packetInfo })
    .success(function(result) {
      if (result == null) cb(msg.noPacketFound());
      else cb(msg.success(result));
    }).error(function(err) {
      cb(msg.unknownError(err)); 
    });
}

/*
 * The listPacket function lists all the packets created by the 
 * subscriber. If successful, a success message containing the list of
 * fetched packet is returned otherwise msg.noPacketFound is returned. 
 */ 

function listPackets(sub_id, cb) {
  Packet.findAll({ where: {subscriber_id: sub_id} })
    .success(function(result) {
      if (result == null) cb(msg.noPacketsFound());
      else cb(msg.success(result));
    }).error(function(err) {
      cb(msg.unknownError(err)); 
    });
}

/*
 * The updatePacket function updates an existing packet's attributes 
 * based on the info passed in. If successful a success message
 * containing the resulting packet is returned.  
 */

function updatePacket(packet, newPacketInfo, cb) {
  Packet.updateAttributes(newPacketInfo)
    .success(function(result) { cb(msg.success(result)); })
    .error  (function(err)    { cb(msg.unknownError(err)); });
}

/*
 * The destroyPacket function deleted a packet entry based
 * on the packet_ID inputted by the subscriber. If successful an
 * empty success message is returned.   
 */

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

