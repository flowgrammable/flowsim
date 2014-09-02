
var flowsimApp = angular.module('flowsimApp');

flowsimApp.controller('packet2Controller',
  function($scope) {
    $scope.packets = [
      'eth1.pkt',
      'eth2.pkt',
      'eth3.pkt'
    ];
    $scope.packetName = '';

    $scope.addPacket = function() {
      $scope.packets.push($scope.packetName);
      $scope.packetName = '';
    }
  });

