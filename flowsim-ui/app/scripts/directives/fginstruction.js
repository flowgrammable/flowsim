'use strict';

angular.module('flowsimUiApp')
  .directive('fgInstruction', function() {
    return {
      templateUrl: 'views/fginstruction.html',
      restrict: 'E',
      scope: {
        match: '=',
        set: '='
      },
      controller: function($scope) {
        $scope.active = {
          index: -1,
        };

        $scope.instructions = [
          $scope.set.meter,
          $scope.set.apply,
          $scope.set.clear,
          $scope.set.write,
          $scope.set.metadata,
          $scope.set.goto_
        ];

        $scope.addApplyAction = function() {
        };
        $scope.popApplyAction = function() {
        };

        $scope.addWriteAction = function() {
        };
        $scope.popWriteAction = function() {
        };
      }
    };
  });

