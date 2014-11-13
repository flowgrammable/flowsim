'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:ResetCtrl
 * @description
 * # ResetCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('ResetCtrl', function ($scope, $routeParams, Subscriber) {

    function clearInputs() {
      $scope.password1 = '';
      $scope.password2 = '';
    }
    clearInputs();

    function clearErrors() {
      $scope.password1Msg = '';
      $scope.password2Msg = '';
      $scope.errorMsg = '';
    }
    clearErrors();

    $scope.reset = function() {
      clearErrors();
      $scope.password1Msg = Subscriber.validatePassword($scope.password1);
      $scope.password2Msg = Subscriber.validatePassword($scope.password2);
      if(!$scope.password1Msg.length && !$scope.password2Msg.length) {
        Subscriber.reset($routeParams.token, $scope.password1,
          function(err) {
            if(err) {
              if(err.detail.type === 'unknownVerificationToken'){
                $scope.errorMsg = 'Rest token has expired';
              } else {
                $scope.errorMsg = err.message;
              }
              console.log(err.details);
            } else {
              $scope.success = true;
            }
          });
          clearInputs();
        }
    };
  });
