var msg = require('./msg');

var orm = require('../../dbbs');
var Packet = orm.model("packet");
// ----------------------------------------------------------------------------
// Packet

function createPacket(name, sub_id, cb) {
  Packet.create({
    name: name,
    subscriber_id: sub_id
  }).success(function(result) {
    cb(msg.success(result));
  }).error(function(err) {
     cb(msg.unknownError(err));
  });
}

function fetchPacket(sub_id, cb) {
  Packet.find({ where: {subscriber_id: sub_id} })
    .success(function(result) {
      if (result == null) cb(msg.subscriberNotFound());
      else cb(msg.success(result));
    }).error(function(err) {
      cb(msg.unknownError(err)); // probably db connection error
    });
}

exports.createPacket = createPacket;
exports.fetchPacket = fetchPacket;

