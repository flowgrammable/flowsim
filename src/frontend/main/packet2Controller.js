
var flowsimApp = angular.module('flowsimApp');

flowsimApp.controller('packet2Controller',
  function($scope) {
    $scope.packets = [
      {
        name: 'eth1.pkt',
      }, {
        name: 'eth2.pkt',
      }, {
        name: 'eth3.pkt',
      }
    ];
    $scope.packetName = '';

    $scope.addPacket = function() {
      $scope.packets.push(
        {
          name: $scope.packetName,
          pos: $scope.packets.length
        });
      $scope.packetName = '';
    }

    $scope.delPacket = function(pos) {
      $scope.packets.splice(pos, 1);
    }
  });

