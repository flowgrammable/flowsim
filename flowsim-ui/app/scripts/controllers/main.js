'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('MainCtrl', function ($scope) {
    $scope.$on('$locationChangeStart', function(event, next, current) {
      console.log('next: '+next);
      console.log('current: '+current);
    });
  });
