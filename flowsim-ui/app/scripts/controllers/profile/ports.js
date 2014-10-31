'use strict';

function mkPort(id) {
  return {
    mac: '00:00:00:00:00:00',
    name: id,
    speed: '1_gbps',
    mode: 'full_duplex',
    medium: 'Copper'
  };
}

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:ProfilePortsCtrl
 * @description
 * # ProfilePortsCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('ProfilePortsCtrl', function ($scope) {

    $scope.portCount = 24;
    $scope.ports = [];

    $scope.Speeds = [{
      label: '10 Mbps',
      value: '10_mbps'
    }, {
      label: '100 Mbps',
      value: '100_mbps'
    }, {
      label: '1 Gbps',
      value: '1_gbps'
    }, {
      label: '10 Gbps',
      value: '10_gbps'
    }, {
      label: '40 Gbps',
      value: '40_gbps'
    }, {
      label: '100 Gbps',
      value: '100_gbps'
    }, {
      label: '1 Tbps',
      value: '1_tbps'
    }];

    $scope.Modes = [{
      label: 'Half Duplex',
      value: 'half_duplex'
    }, {
      label: 'Full Duplex',
      value: 'full_duplex'
    }];
    
    $scope.Mediums = [
      'Copper',
      'Fiber'
    ];

    $scope.buildPorts = function() {
      var i, base;
      // If a contraction, shorten the end
      if($scope.portCount < $scope.ports.length) {
        $scope.ports.splice($scope.portCount, 
                            $scope.ports.length - $scope.portCount);
      } else if($scope.portCount > $scope.ports.length) {
      // otherwise append
        base = $scope.ports.length;
        for(i=base; i < $scope.portCount; ++i) {
          $scope.ports.push(mkPort(base+i));
        }
      }
    };
    $scope.buildPorts();

  });
