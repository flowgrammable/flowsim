'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:UpdateCtrl
 * @description
 * # UpdateCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('UpdateCtrl', function ($scope, Subscriber) {

    function clearInputs() {
      $scope.oldPassword = '';
      $scope.password1 = '';
      $scope.password2 = '';
    }
    clearInputs();
    
    function clearErrors() {
      $scope.oldPasswordMsg = '';
      $scope.password1Msg   = '';
      $scope.password2Msg   = '';
      $scope.errormsg       = '';
    }
    clearErrors();

    $scope.update = function() {
      clearErrors();
      $scope.oldPasswordMsg = Subscriber.validatePassword($scope.oldPassword);
      $scope.password1Msg   = Subscriber.validatePassword($scope.password1);
      $scope.password2Msg   = $scope.password1 === $scope.password2 ? 
                              '' : 'Passwords do not match';

      if(!$scope.oldPasswordMsg.length && !$scope.password1Msg.length && 
         !$scope.password2Msg.length) {
        Subscriber.update($scope.oldPassword, $scope.password1,
          function(err, result) {
            if(err) {
              $scope.errorMsg = err.message;
              console.log(err.detail);
            } else {
              $scope.success = true;
            }
          });
        clearInputs();
      }
    };
  });
