'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:ResetCtrl
 * @description
 * # ResetCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('ResetCtrl', function ($scope) {
    $scope.email = '';

    $scope.reset = function() {
    };
  });
