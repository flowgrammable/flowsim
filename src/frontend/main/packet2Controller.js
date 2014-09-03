
var flowsimApp = angular.module('flowsimApp');

function Packet(name) {
  this.name = name;
}

var acceptableName = /[a-zA-Z_][a-zA-Z0-9_]*/;

flowsimApp.controller('packet2Controller',
  function($scope) {
    $scope.packets = [];
    $scope.packetName = '';
    $scope.badPacketName = false;

    $scope.addPacket = function() {
      if(acceptableName.test($scope.packetName)) {
        $scope.packets.push(new Packet($scope.packetName));
        $scope.packetName = '';
        $scope.badPacketName = false;
      } else {
        $scope.badPacketName = true;
      }
    }

    $scope.delPacket = function(pos) {
      delete $scope.packets.splice(pos, 1);
    }
  });

