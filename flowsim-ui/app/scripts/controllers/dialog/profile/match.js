'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:DialogProfileMatchCtrl
 * @description
 * # DialogProfileMatchCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('DialogProfileMatchCtrl', function ($scope, $modalInstance, 
                                                  matchCaps) {
    $scope.matchCaps = matchCaps;

    $scope.ok = function() {
      $modalInstance.close($scope.matchCaps);
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
