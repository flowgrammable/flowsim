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

/*
 * packetCreate function is responsible for creating packet with the 
 * give name and storing it in the database. This is done using createPacket 
 * adapter function. If successful, it returns msg.success() else an error 
 * msg is returned.
 */
function packetCreate(adapter, name, sub_id, cb) {
  adapter.createPacket(sub_id, name, function(err, result) {
    if(err) cb(err);  
    else cb(result); 
  });
}


/*
 * packetList function is responsible for listing all the packets belonging 
 * to the user with the subscriber id as sub_Id. This is done using 
 * listPackets adapter function. On success it returns the list of packets 
 * else it returns error message.
 */
function packetList(adapter, sub_Id, cb) {
  adapter.listPackets(sub_Id, function(result) {
    var packets = result.value;
    var list = new Array();
    for(var i = 0;i<packets.length;i++) 
      list[i] = { id: packets[i].id, name: packets[i].name }
    cb(msg.success(list));
  });
}

/*
 * packetDetail function is responsible for fetching the details of a packet 
 * with packet id pack_id belonging to the user with subscriber id sub_id. 
 * It internally calls fetchPacket adapter function for fetching packet. 
 * On success it returns the details of the packet and on failure it returns 
 * error message.
 */
function packetDetail(adapter, sub_id, pack_id, cb) {
  var packetInfo = { subscriber_id: sub_id, id: pack_id };
  adapter.fetchPacket(packetInfo, function(err, result) {
    if(err) cb(err);
    else cb(result);
  });
}

/*
 * packetUpdate function is responsible for udpating details of an existing 
 * packet. This is done in two async phases. First, the existing packet to be 
 * updated is fetched from the database using the fetchPacket adapter function. 
 * Second, the fetched packet is updated based on the values provided in 
 * newPacketInfo using the updatePacket adapter function. On success, the 
 * existing packet is updated and msg.success() is returned or error 
 * message is returned. 
 */
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

/*
 * The packetDestroy function is responsible for deleting the
 * packet with the given id from the database. This is done in two 
 * async phases. First, the packet is fetched from the database by
 * the id given in the url of the request, and the subscriber_id, 
 * which was retrieved through the session. These semantics ensure 
 * that a subscriber may only delete their own packet. If the fetch 
 * is successful, the adapter function to update the packet's 
 * attributes is called, resulting in either a msg.success() or 
 * error message being returned.
 */
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
      detail: _.bind(packetDetail, null, adapter),
      update: _.bind(packetUpdate, null, adapter),
      destroy: _.bind(packetDestroy, null, adapter),
    }
  };
}

