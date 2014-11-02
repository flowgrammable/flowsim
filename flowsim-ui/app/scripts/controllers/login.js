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
      $scope.errorMsg = '';
    }
    clearErrors();

    $scope.login = function() {
      clearErrors();
      $scope.emailMsg    = Subscriber.validateEmail($scope.email);
      $scope.passwordMsg = Subscriber.validatePassword($scope.password);
      if(!$scope.emailMsg.length && !$scope.passwordMsg.length) {
        Subscriber.login($scope.email, $scope.password, function(err) {
          if(err) {
            $scope.errorMsg = err.message;
            console.log(err.details);
          } else {
            $scope.$emit('subscriberAuth', true);
            $location.path('/');
            $route.reload();
          }
        });
        clearInputs();
      }
    };
  });
