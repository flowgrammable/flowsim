'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('MainCtrl', function ($scope, $modal) {

  $scope.signup = function() {
    $modal.open({
      templateUrl: 'views/signup.html',
      controller: 'SignupCtrl',
      size: 'md',
    }).result.then(function () {
    });
  };
  });
