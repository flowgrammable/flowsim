
(function(){

var namePattern = /[a-zA-Z_][a-zA-Z_0-9]*/;
var pktCache = {};

var packetController = function($scope, packetService, Packet) {

  $scope.isInit = false;
  $scope.packet = null;
  $scope.pktNames = [];

  packetService.getPackets(function(data, err) {
    if(data) {
      // for each packet in response
      for(var i=0; i<data.length; ++i) {
        $scope.pktNames.push(data[i].name);   // add name to list
        pktCache[data[i].name] = data[i];     // add packet to cache
      }
      // consider the list initialized
      $scope.isInit = true;
    } else if(err) {
      console.log('Could not get initial list:' + err);
    }
  });
 
  $scope.createProtocol = function(name) {
    return Packet.createProtocol(name);
  };

  // This function is called by the UI to 
  // save the modifications to the current
  // packet to the persistent store
  $scope.savePacket = function() {
    if(packet !== null) {
      packetService.savePacket(packet);
    }
  };

  // This function is called by the UI to
  // revert the current packet modifications
  $scope.revertPacket = function() {
    packetService.revertPacket(packet.name);
  };

  // This function is called by the UI widget to
  // create a new named packet
  $scope.addPacket = function(name) {
    if(!namePattern.test(name)) {
      return 'Bad name';
    } else if(name in pktCache) {
      return 'Name exists';
    } else {
      pktCache[name] = new Packet.createPacket(name);
      return 'success';
    }
  };

  // This function is called by the UI widget to
  // delete a named packet
  $scope.delPacket = function(name) {
    packetService.delPacket(name);
    if(name in pktCache) {
      delete pktCache[name];
    }
  };

  // This function is called by the UI widget to
  // change the focus of a named packet
  $scope.setPacket = function(name) {
    if(typeof name === 'string' && name in pktCache) {
      $scope.packet = pktCache[name];
      // Notify any children controllers of the focus change
      // .. need to look at this in detail ...
      fgPacketAdaptor
      $scope.$broadcast('change', pktCache[name]);
    } else {
      console.log('No packets for list foucs');
    }
  };

};

var fgPacket = angular.module('fgPacket');
fgPacket.controller('packetController', packetController);

})();

