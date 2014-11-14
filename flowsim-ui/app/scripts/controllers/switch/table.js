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

  $scope.flow = {
    priority: null
  };
  $scope.table = [];

  $scope.tableId = 0;
  $scope.setTable = function(idx) {
    $scope.tableId = idx;
    $scope.table = $scope.device.tables.tables[$scope.tableId].flatten();
  };

  $scope.delFlow = function(idx) {
    console.log('delFlow - table('+$scope.tableId+', '+idx+')');
    var flow = $scope.table[idx];
    $scope.device.tables.tables[$scope.tableId].del(flow.priority, flow);
  }

  $scope.newFlow = function() {
    var flow = true;
    $modal.open({
      templateUrl: 'views/switch/flow.html',
      controller: 'SwitchFlowCtrl',
      size: 'lg',
      resolve: { 
        priority: function() { return $scope.flow.priority; }
      }
    }).result.then(function (flow) {
      $scope.device.tables.tables[$scope.tableId].add(flow.priority, flow);
      $scope.table = $scope.device.tables.tables[$scope.tableId].flatten();
      $scope.flow.priority = null;
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
