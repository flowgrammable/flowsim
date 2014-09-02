
var flowsimApp = angular.module('flowsimApp');

flowsimApp.controller('packet2Controller',
  function($scope) {
    $scope.packets = [
      'eth1.pkt',
      'eth2.pkt',
      'eth3.pkt'
    ];
  });

