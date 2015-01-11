'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgSwitchPorts
 * @description
 * # fgSwitchPorts
 */
angular.module('flowsimUiApp')
  .directive('fgSwitchPorts', function () {
    return {
      templateUrl: 'views/switch/ports.html',
      restrict: 'E',
      controller: 'SwitchPortsCtrl'
    };
  }).controller('SwitchPortsCtrl', function($scope){
    $scope.togglePort = function(id) {
      var port = $scope.device.ports.ports[id-1];
      port.config.port_down = !port.config.port_down;
      port.state.link_down = port.config.port_down;
      $scope.setDirty();
    };
  });
