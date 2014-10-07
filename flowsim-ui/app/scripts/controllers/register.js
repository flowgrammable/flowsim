'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('RegisterCtrl', function ($scope, Subscriber) {

    function clearInputs() {
      $scope.email     = '';
      $scope.password1 = '';
      $scope.password2 = '';
    }
    clearInputs();

    function clearErrors() {
      $scope.emailMsg     = '';
      $scope.password1Msg = '';
      $scope.password2Msg = '';
      $scope.errorMsg     = '';
    }
    clearErrors();

    $scope.register = function() {
      clearErrors();
      $scope.emailMsg     = Subscriber.validateEmail($scope.email);
      $scope.password1Msg = Subscriber.validatePassword($scope.password1);
      $scope.password2Msg = $scope.password1 === $scope.password2 ?
                            '' : 'Passwords do not match';
      if(!$scope.emailMsg.length && !$scope.password1Msg.length && 
         !$scope.password2Msg.length) {
        Subscriber.register($scope.email, $scope.password1,
          function(err, result) {
            if(err) {
              $scope.errorMsg = err.message;
              console.log(err.details);
            } else {
              $scope.success = true;
            }
            clearInputs();
          });
      }
    };
  });
