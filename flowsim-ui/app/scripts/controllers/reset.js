'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:ResetCtrl
 * @description
 * # ResetCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('ResetCtrl', function ($scope, Subscriber) {

    function clearInputs() {
      $scope.email = '';
    }
    clearInputs();

    function clearErrors() {
      $scope.emailMsg = '';
    }
    clearErrors();

    $scope.reset = function() {
      clearErrors();
      $scope.emailMsg = Subscriber.validateEmail($scope.email);
      if(!$scope.emailMsg.length) {
        clearInputs();
      }
    };
  });
