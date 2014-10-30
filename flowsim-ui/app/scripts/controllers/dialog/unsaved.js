'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:DialogUnsavedCtrl
 * @description
 * # DialogUnsavedCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('DialogUnsavedCtrl', function ($scope, $modalInstance) {
      $scope.ok = function () {
        $modalInstance.close();
      };
      
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
  });
