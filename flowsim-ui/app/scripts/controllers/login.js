'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('LoginCtrl', function ($scope, $route, $location, Subscriber) {

    function clearInputs() {
      $scope.email = '';
      $scope.password = '';
    }
    clearInputs();

    function clearErrors() {
      $scope.emailMsg = '';
      $scope.passwordMsg = '';
    }
    clearErrors();

    $scope.login = function() {
      clearErrors();
      $scope.emailMsg    = Subscriber.validateEmail($scope.email);
      $scope.passwordMsg = Subscriber.validatePassword($scope.password);
      if(!$scope.emailMsg.length && !$scope.passwordMsg.length) {
        $scope.$emit('subscriberAuth', true);
        clearInputs();
        $location.path('/');
        $route.reload();
      }
    };
  });
