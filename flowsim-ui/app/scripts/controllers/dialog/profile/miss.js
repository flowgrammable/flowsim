'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:DialogProfileMissCtrl
 * @description
 * # DialogProfileMissCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('DialogProfileMissCtrl', function ($scope, $modalInstance, tips, 
                                                 tests, miss) {
    $scope.tips = tips;
    $scope.tests = tests;
    $scope.miss = miss;
      
    $scope.ok = function() {
      $modalInstance.close($scope.miss);
    };
    
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

  });
