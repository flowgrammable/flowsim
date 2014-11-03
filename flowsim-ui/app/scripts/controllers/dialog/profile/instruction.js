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
                                                        fgConstraints,
                                                        tips, tests, 
                                                        instruction) {
    $scope.tips = tips;
    $scope.tests = tests;
    $scope.instruction = instruction;

    $scope.range = '';
    $scope.errorMsg = '';

    $scope.add = function(range) {
      var extract = /^([0-9]+)(\.\.([0-9]+))?$/;
      var match, result;
    
      $scope.errorMsg = '';

      if(!$scope.tests.goto_(range)) {
        $scope.errorMsg = 'Invalid Range';
      } else {
        match = range.match(extract);
        result = {};
        if(match[1] && fgConstraints.isUInt(0, 255)) {
          result.first = match[1];
        } else {
          $scope.errorMsg = 'Invalid Range';
        }
        if(match[3]) {
          if(fgConstraints.isUInt(0, 255)) {
            result.second = match[3];
            $scope.instruction.goto_.push(result);
            $scope.range = '';
          }
          else {
            $scope.errorMsg = 'Invalid Range';
          }
        } else {
          result.second = result.first;
          $scope.instruction.goto_.push(result);
          $scope.range = '';
        }
      }
    };
    $scope.del = function(idx) {
      $scope.instruction.goto_.splice(idx, 1);
    };

    $scope.ok = function() {
      $modalInstance.close($scope.instruction);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

  });
