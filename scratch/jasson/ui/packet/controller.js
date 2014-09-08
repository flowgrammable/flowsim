
(function(){

var namePattern = /[a-zA-Z_][a-zA-Z_0-9]*/;
var pktCache = {};

var Controller = function($scope, pktStorage, pktAdaptor) {

  $scope.packet = null;

  pktStorage.getPackets(function(data, err) {
    var list = [];
    if(data) {
      // for each packet in response
      for(var i=0; i<data.length; ++i) {
        pktCache[data[i].name] = data[i];     // add packet to cache
        list.push(data[i].name);
      }
      $scope.$broadcast('initList', list);
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
      pktStorage.savePacket(packet);
    }
  };

  // This function is called by the UI to
  // revert the current packet modifications
  $scope.revertPacket = function() {
    pktStorage.revertPacket(packet.name);
  };

  // This function is called by the UI widget to
  // create a new named packet
  $scope.addPacket = function(name) {
    if(!namePattern.test(name)) {
      return 'Bad name';
    } else if(name in pktCache) {
      return 'Name exists';
    } else {
      //pktCache[name] = new Packet.createPacket(name);
      return 'success';
    }
  };

  // This function is called by the UI widget to
  // delete a named packet
  $scope.delPacket = function(name) {
    if(name in pktCache) {
      pktStorage.delPacket(name);
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
      $scope.$broadcast('change', pktCache[name]);
    } else {
      console.log('No packets for list foucs');
    }
  };

};

angular.module('fgPacket')
  .controller('pktController', Controller);

})();

