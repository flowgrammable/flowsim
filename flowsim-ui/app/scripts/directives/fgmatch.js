'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgMatch
 * @description
 * # fgMatch
 */
angular.module('flowsimUiApp')
  .directive('fgMatch', function () {
    return {
      templateUrl: 'views/fgmatch.html',
      restrict: 'E',
      scope: {
        profiles: '=',
        matches: '=',
        addMatchCB: '&addMatch'
      },
      controller: function($scope) {

        $scope.active = {
          protocols: [],
          protocol: '',
          fields: [],
          field: '',
          value: '',
          mask: '',
          type: null
        };

        $scope.updateProtocol = function() {

          // Clear the dependent properties
          $scope.active.field = '';
          $scope.active.value = '';
          $scope.active.mask  = '';
          $scope.active.tiype = null;
        };

        $scope.updateField = function() {

          // Clear the dependent properties
          $scope.active.value = '';
          $scope.active.mask  = '';
        }

        $scope.addMatch = function() {
          $scope.addMatchCB()();
        };

        $scope.popMatch = function() {
          $scope.matches.pop();
        };
      }
    };
  });
