'use strict';

angular.module('flowsimUiApp')
  .directive('fgInstruction', function() {
    return {
      templateUrl: 'views/fginstruction.html',
      restrict: 'E',
      scope: {
        match: '=',
        set: '=',
        caps: '='
      },
      controller: function($scope) {
        $scope.active = {
          index: -1,
        };

        $scope.setEnabled = function(name){
          var instruction = _($scope.set).findWhere({name: name});
          instruction.enabled = !instruction.enabled;
        };

        $scope.isEnabled = function(name){
          return _($scope.set).findWhere({name: name, enabled: true});
        };
        $scope.instructionProfile = [
          $scope.caps.instruction.meter,
          $scope.caps.instruction.apply,
          $scope.caps.instruction.clear,
          $scope.caps.instruction.write,
          $scope.caps.instruction.metadata,
          $scope.caps.instruction.goto_
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

