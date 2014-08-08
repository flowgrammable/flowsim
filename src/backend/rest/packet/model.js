var _ = require('underscore');
var async = require('async');
var msg = require('./msg');
var adapter = require('./adapter');
var config = true;

function resultChecker(result, callback){
  if(result.value) callback(null, result);
  else if(result.error) callback(result, null);
  else throw "Undefined success and error objects";
}

// ----------------------------------------------------------------------------
// Packet

function packetCreate(adapter, name, sub_id, cb) {
  // 1. Insert User created packet
  adapter.createPacket(sub_id, name, function(err, result) {
    if(err) cb(err);  
    else cb(result); 
  });
}


function packetFetch(adapter, sub_id, cb) {
  adapter.fetchPacket(sub_id, function(err, result) {
    if(err) cb(err);  
    else cb(result);
  });
}

function packetList(adapter, sub_Id, cb) {
  adapter.listPackets(sub_Id, function(result) {
    var packets = result.value;
    var list = new Array();
    for(i in packets) list[i] = { id: packets[i].id, name: packets[i].name }
    cb(msg.success(list));
  });
}

function packetUpdate(adapter, sub_Id, newPacketInfo, cb) {
  async.waterfall([
    function(callback){
      var packetInfo = { subscriber_id: sub_Id, id: newPacketInfo.id };
      adapter.fetchPacket(packetInfo, function(result){
        resultChecker(result, callback);
      });
    },
    function(result, callback){
      var packet = result.value;
      adapter.updatePacket(packet, newPacketInfo, function(result) {
        resultChecker(result, callback);
      });
    }
    ], function(err, result){
      if(err) { cb(err); }
      else    { cb(msg.success()); }
    });
}

function packetDestroy(adapter, sub_Id, packet_Id, cb) {
  async.waterfall([
    function(callback){
      var packetInfo = { subscriber_id: sub_Id, id: packet_Id };
      adapter.fetchPacket(packetInfo, function(result){
        resultChecker(result, callback);
      });
    },
    function(result, callback) {
      var packet = result.value;
      adapter.destroyPacket(packet, function(result) {
        resultChecker(result, callback);
      });
    }
    ], function(err, result) {
      if(err) cb(err); 
      else cb(result); 
    });
}

module.exports = function(testAdapter) {
  if(testAdapter){
		adapter = testAdapter;
  }
  return {
    packet: {
      create: _.bind(packetCreate, null, adapter),
      list:  _.bind(packetList, null, adapter),
      fetch: _.bind(packetFetch, null, adapter),
      update: _.bind(packetUpdate, null, adapter),
      destroy: _.bind(packetDestroy, null, adapter),
    }
  };
}

