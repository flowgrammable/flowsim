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

    $scope.isValidInput =function(input){
      return input.$dirty && input.$valid;
    };
    $scope.isInValidInput =function(input){
      return input.$dirty && input.$invalid;
    };

    $scope.$watch('email', function(email){
      if(!Subscriber.validateEmail(email).length){
        $scope.regForm.email.$setValidity('email', true);
      }else{
        $scope.regForm.email.$setValidity('email', false);
      }
    });
    $scope.$watch('password1', function(password){
      if(!Subscriber.validatePassword(password).length){
        $scope.regForm.password1.$setValidity('password1', true);
      }else{
        $scope.regForm.password1.$setValidity('password1', false);
      }
    });
    $scope.$watch('password2', function(password){
      if($scope.password1===password){
        $scope.regForm.password2.$setValidity('password2', true);
      }else{
        $scope.regForm.password2.$setValidity('password2', false);
      }
    });
    $scope.register = function() {
      clearErrors();
      $scope.emailMsg     = Subscriber.validateEmail($scope.email);
      $scope.password1Msg = Subscriber.validatePassword($scope.password1);
      $scope.password2Msg = $scope.password1 === $scope.password2 ?
                            '' : 'Passwords do not match';
      if(!$scope.emailMsg.length && !$scope.password1Msg.length &&
         !$scope.password2Msg.length) {
        Subscriber.register($scope.email.toLowerCase(), $scope.password1,
          function(err) {
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
