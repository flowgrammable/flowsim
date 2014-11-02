'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:VerifyCtrl
 * @description
 * # VerifyCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('VerifyCtrl', function ($scope, $routeParams, Subscriber) {

    function clearErrors() {
      $scope.errorMsg = '';
    }
    clearErrors();

    Subscriber.verify($routeParams.token, function(err) {
      if(err) {
        $scope.errorMsg = err.message;
        console.log(err.details);
      } else {
        $scope.success = true;
      }
    });
  });
