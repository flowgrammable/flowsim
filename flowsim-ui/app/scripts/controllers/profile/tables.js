'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:ProfileTableCtrl
 * @description
 * # ProfileTableCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('ProfileTablesCtrl', function ($scope) {
    $scope.match = function() {
      console.log('match');
    };
    $scope.instruction = function() {
      console.log('instruction');
    };
    $scope.instructionMiss = function() {
      console.log('instruction miss');
    };
  });
