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
                                                        instruction) {
    $scope.instruction = instruction;

    $scope.ok = function() {
      $modalInstance.close($scope.instruction);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

  });
