'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:ResetCtrl
 * @description
 * # ResetCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('ForgotCtrl', function ($scope, Subscriber) {

    function clearInputs() {
      $scope.email = '';
    }
    clearInputs();

    function clearErrors() {
      $scope.emailMsg = '';
      $scope.errorMsg = '';
    }
    clearErrors();

    $scope.reset = function() {
      clearErrors();
      $scope.emailMsg = Subscriber.validateEmail($scope.email);
      if(!$scope.emailMsg.length) {
        Subscriber.reset($scope.email, function(err, result) {
          if(err) {
            $scope.errorMsg = err.message;
            console.log(err.details);
          } else {
            $scope.success = true;
          }
        });
        clearInputs();
      }
    };
  });
