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

    $scope.errorMsg = '';
    $scope.nextTables = '';

    $scope.add = function() {
      var extract = /^([0-9]+)(\.\.([0-9]+))?$/;
      var match, result;
    
      $scope.errorMsg = '';

      console.log($scope.nextTables);

      if(!$scope.tests.goto_($scope.nextTables)) {
        $scope.errorMsg = 'Invalid Range';
      } else {
        match = $scope.nextTables.match(extract);
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
            $scope.nextTables = '';
          }
          else {
            $scope.errorMsg = 'Invalid Range';
          }
        } else {
          result.second = result.first;
          $scope.instruction.goto_.push(result);
          $scope.nextTables = '';
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
