'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('RegisterCtrl', function ($scope) {
    $scope.email = '';
    $scope.password1 = '';
    $scope.password2 = '';

    $scope.register = function() {
    };
  });
