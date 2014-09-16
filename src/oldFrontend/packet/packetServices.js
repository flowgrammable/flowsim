
var packetService = angular.module('packetService', []);

packetService.factory('packetManager', function() {

  var namePattern = /[a-zA-Z_][a-zA-Z0-9_]*/;

  var names = {};
  var packets = [];

  // initialize packet list from backend
  //
  // add code
  //

  function _getPackets() {
    return packets;
  }

  function _addPacket(name) {
    // Validate the name is ok
    if(!namePattern.test(name)) {
      return 'badName';
    }
    // Validate the name is not in use
    if(name in names) {
      return 'nameExists';
    }
    // Add the name
    names[name] = true;
    packets.push(name);
  }

  function _delPacket(pos) {
    // Validate the array position
    if(pos >= -1 && pos < packets.length) {
      // remove the references
      tmp = packets.splice(pos, 1);
      if(tmp.name in names) {
        delete names[tmp.name];
      }
      delete tmp;
    }
  }

  function _savePacket(pos) {
    // synchronize new state with backend
  }

  return {
    getPackets : _getPackets,
    addPacket : _addPacket,
    delPacket : _delPacket,
    savePacket : _savePacket
  };
});
