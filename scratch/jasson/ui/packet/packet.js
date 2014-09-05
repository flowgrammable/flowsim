
var fgPacket = angular.module('fgPacket', []);

var Packet = function() {
};

fgPacket.controller('packetCtrl', function($scope) {

  var namePattern = /[a-zA-Z_][a-zA-Z_0-9]*/;
  $scope.packets = {};
  $scope.packet = null;
  $scope.hide = false;

  $scope.listPackets = function() {
    return $scope.packets;
  }

  $scope.addPacket = function(name) {
    if(!namePattern.test(name)) {
      return 'Bad name';
    } else if(name in $scope.packets) {
      return 'Name exists';
    } else {
      $scope.packets[name] = new Packet();
      return 'success';
    }
  }

  $scope.delPacket = function(name) {
    if(name in $scope.packets) {
      delete $scope.packets[name];
    }
  }

  $scope.setPacket = function(name) {
    $scope.packet = $scope.packets[name];
  }

});

