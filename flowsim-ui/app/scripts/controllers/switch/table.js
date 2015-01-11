'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SwitchTableCtrl
 * @description
 * # SwitchTableCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SwitchTableCtrl', function ($scope, $modal, Flow) {

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
    var flow = $scope.table[idx];
    $scope.device.tables.tables[$scope.tableId].del(flow.priority, flow);
    $scope.table = $scope.device.tables.tables[$scope.tableId].flatten();
  }

  $scope.newFlow = function(priority) {
    var caps =  $scope.device.tables.tables[$scope.tableId].capabilities;
    var flow = new Flow.Flow(null, priority);
    $modal.open({
      templateUrl: 'views/switch/flow.html',
      controller: 'SwitchFlowCtrl',
      size: 'lg',
      resolve: {
        flow: function() {
          return flow;
        },
        caps: function() {
          return caps;
        }
      }
    }).result.then(function (flow) {
      $scope.device.tables.tables[$scope.tableId].add(flow.priority, flow);
      $scope.table = $scope.device.tables.tables[$scope.tableId].flatten();
    });
  };

  $scope.openFlow = function(priority, idx) {
    var caps = $scope.device.tables.tables[$scope.tableId].capabilities;
    var flow = $scope.table[idx];
    if(flow) {
      $modal.open({
        templateUrl: 'views/switch/flow.html',
        controller: 'SwitchFlowCtrl',
        size: 'lg',
        resolve: { 
          flow: function() { 
            return flow.clone(); 
          },
          caps: function() {
            return caps;
          }
        } 
      }).result.then(function (nflow) {
        flow.assign(nflow);
        $scope.table = $scope.device.tables.tables[$scope.tableId].flatten();
      });
    }
  };

  $scope.$watch('device.tables.tables.length',function(){
    if($scope.device && $scope.device.tables.tables.length > 0){
      $scope.setTable(0);
    }
  });

});
