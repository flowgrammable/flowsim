'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('LoginCtrl', function ($scope) {
    $scope.email = '';
    $scope.emailMsg = '';
    $scope.password = '';
    $scope.passwordMsg = '';

    $scope.login = function() {

    }
  });
