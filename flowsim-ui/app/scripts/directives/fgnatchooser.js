'use strict';

angular.module('flowsimUiApp')
  .directive('fgNatChooser', function (UInt) {
    return {
      templateUrl: 'views/fgnatchooser.html',
      restrict: 'E',
      replace: true,
      scope: {
        action: '&',
        label: '=',
        tip: '='
      },
      controller: function($scope) {

        $scope.active = {
          value: ''
        };

        $scope.test = UInt.is(32);

        $scope.set = function() {
          if($scope.active.value.length === 0 || 
             !$scope.test($scope.active.value)) {
            throw 'Bad fgNatChooser set: '+$scope.active.value;
          }
          $scope.action()(parseInt($scope.active.value));
          $scope.active.value = '';
        };

      }
    };
  });
