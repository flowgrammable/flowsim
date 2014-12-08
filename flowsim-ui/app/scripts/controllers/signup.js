'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('SignupCtrl', function ($modalInstance, $scope, Subscriber) {

    function clearInputs() {
      $scope.email     = '';
    }
    clearInputs();

    function clearErrors() {
      $scope.emailMsg     = '';
      $scope.errorMsg     = '';
    }
    clearErrors();

    $scope.signup = function() {
      clearErrors();
      $scope.emailMsg     = Subscriber.validateEmail($scope.email);
      if(!$scope.emailMsg.length) {
        Subscriber.signup($scope.email,
          function(err) {
            if(err) {
              $scope.emailMsg = err.message;
              console.log(err.details);
            } else {
              $modalInstance.close();
              $scope.success = true;
            }
            clearInputs();
          });
      }
    
    };
  });
