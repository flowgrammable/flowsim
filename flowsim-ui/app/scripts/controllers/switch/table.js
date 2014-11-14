'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SwitchTableCtrl
 * @description
 * # SwitchTableCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SwitchTableCtrl', function ($scope, $modal) {

  $scope.active = 0;
  $scope.toggle = function(idx) {
    $scope.active = idx;
  };

  $scope.openFlow = function(idx) {
    $modal.open({
      templateUrl: 'views/dialog/switch/flow.html',
      controller: 'DialogSwitchFlowCtrl',
      size: 'lg',
      resolve: {
        flow: function() { 
          return $scope.device.tables.tables.get(priority, idx); 
        }
      }
    }).result.then(function (flow) {
    });
  };

});
