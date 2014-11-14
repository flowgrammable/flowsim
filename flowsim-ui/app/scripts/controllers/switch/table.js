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

  $scope.priority = null;

  $scope.active = 0;
  $scope.toggle = function(idx) {
    $scope.active = idx;
  };

  $scope.delFlow = function() {
    console.log('delFlow');
  }

  $scope.newFlow = function() {
    var flow = true;
    $modal.open({
      templateUrl: 'views/switch/flow.html',
      controller: 'SwitchFlowCtrl',
      size: 'lg',
      resolve: { flow: function() { return flow; } }
    }).result.then(function (flow) {
    });
  };

  $scope.openFlow = function(priority, idx) {
    var flow = true;
    //var flow = $scope.device.tables.tables.get(priority, idx);
    if(flow) {
      $modal.open({
        templateUrl: 'views/switch/flow.html',
        controller: 'SwitchFlowCtrl',
        size: 'lg',
        resolve: { flow: function() { return flow; } }
      }).result.then(function (flow) {
      });
    }
  };

});
