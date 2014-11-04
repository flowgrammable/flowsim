'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SimulationCtrl
 * @description
 * # SimulationCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SimulationCtrl', function ($scope) {

    $scope.active = false;
    $scope.stages = [{
      name: 'Packet Arrival',
      label: 'arrival',
      active: false
    }, {
      name: 'Field Extraction',
      label: 'extraction',
      active: false
    }, {
      name: 'Table Selection',
      label: 'choice',
      active: false
    }, {
      name: 'Flow Selection',
      label: 'selection',
      active: false
    }, {
      name: 'Instruction Execution',
      label: 'execution',
      active: false
    }];
    
    $scope.play = function() {
      console.log('play');
      if($scope.active) {
        return;
      }
      $scope.active = true;
      $scope.stages[0].active = true;
    };

    $scope.stop = function() {
      console.log('stop');
      if(!$scope.active) {
        return;
      }
      $scope.active = false;
    };

    $scope.pause = function() {
      console.log('pause');
      if(!$scope.active) {
        return;
      }
    };

    $scope.step = function() {
      console.log('step');
      var idx;
      if(!$scope.active) {
        return;
      }
      for(idx=0; idx<$scope.stages.length; ++idx) {
        if($scope.stages[idx].active) {
          $scope.stages[idx].active = false;
          $scope.stages[(idx+1)%$scope.stages.length].active = true;
          return;
        }
      }
    };

  });
