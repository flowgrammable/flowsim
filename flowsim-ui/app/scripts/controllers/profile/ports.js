'use strict';

function twoZs(v) {
  var val = v.toString(16);
  if(val.length < 2) {
    return '0' + val;
  } else {
    return val;
  }
}

function mkPort(id) {
  return {
    mac: '00:00:00:00:00:' + twoZs(id),
    name: 'eth'+id,
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

    $scope.macTest = function() {
      return true;
    };
    $scope.nameTest = function() {
      return true;
    };
    $scope.macTip = '';
    $scope.nameTip = '';

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

    $scope.speedTip = '';

    $scope.Modes = [{
      label: 'Half Duplex',
      value: 'half_duplex'
    }, {
      label: 'Full Duplex',
      value: 'full_duplex'
    }];

    $scope.modeTip = '';
    
    $scope.Mediums = [
      'Copper',
      'Fiber'
    ];

    $scope.mediumTip = '';

    $scope.buildPorts = function() {
      var i, base;
      // If a contraction, shorten the end
      if($scope.ports.n_ports < $scope.ports.ports.length) {
        $scope.ports.ports.splice($scope.ports.n_ports, 
                                  $scope.ports.ports.length - $scope.ports.n_ports);
      } else if($scope.ports.n_ports > $scope.ports.ports.length) {
      // otherwise append
        base = $scope.ports.ports.length;
        for(i=base; i < $scope.ports.n_ports; ++i) {
          $scope.ports.ports.push(mkPort(base+i));
        }
      }
    };
    $scope.buildPorts();

  });
