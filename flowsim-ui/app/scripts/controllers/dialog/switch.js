'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:DialogSwitchCtrl
 * @description
 * # DialogSwitchCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('DialogSwitchCtrl', function ($scope, $modalInstance, profiles) {

    $scope.profiles = profiles;
    $scope.profile = '';

    $scope.ok = function () {
      $modalInstance.close($scope.profile);
    };
    
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
