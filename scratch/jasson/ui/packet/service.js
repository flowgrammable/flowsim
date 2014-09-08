
(function(){

var Storage = function($http) {

  // Initialize the local packet cache with
  // what current exists on the backend
  function _getPackets(cb) {
    $http.get('data/packets.json')
      .success(function(data) {
        cb(angular.fromJson(data));
      }).error(function(data) {
        cb(null, data);
      });
  }

  function _savePacket(pkt) {
    $http({
      method: 'POST',
      url: ('packet/' + pkt.name),
      data: angular.toJson(pkt, true)
    }).success(function(data) {
      console.log('saved packet: ' + pkt.name);
    }).error(function(data) {
      console.log('failed to remotely save packet: ' + pkt.name);
    });
  }

  function _delPacket(name) {
    $http({
      method: 'DELETE',
      url: ('packet/' + name)
    }).success(function(data) {
      console.log('deleted packet: ' + name);
    }).error(function(data) {
      console.log('failed to remotely delete: ' + name);
    });
  }

  return {
    // Packet management 
    getPackets: _getPackets,            // grab all packet data from backend
    savePacket: _savePacket,            // save a packet by name
    delPacket: _delPacket,              // delete a packet by name
  };
};

angular.module('fgPacket', [])
  .service('pktStorage', Storage);

})();

