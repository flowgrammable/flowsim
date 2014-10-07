'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:UpdateCtrl
 * @description
 * # UpdateCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('UpdateCtrl', function ($scope) {
    $scope.oldPassword = '';
    $scope.password1 = '';
    $scope.password2 = '';

    $scope.update = function() {
    };
  });
