'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:DialogProfileInstructionCtrl
 * @description
 * # DialogProfileInstructionCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('DialogProfileInstructionCtrl', function ($scope, $modalInstance, 
                                                        tips, tests, 
                                                        instruction) {
    $scope.tips = tips;
    $scope.tests = tests;
    $scope.instruction = instruction;

    $scope.ok = function() {
      $modalInstance.close($scope.instruction);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

  });
