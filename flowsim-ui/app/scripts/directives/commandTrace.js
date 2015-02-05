'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:trace
 * @description
 * # trace
 */
angular.module('flowsimUiApp')
  .directive('commandTrace', function () {
    return {
      templateUrl: 'views/commandTrace.html',
      restrict: 'E',
      scope: {
      },
      controller: function($scope) {
        $scope.title = 'Packet Trace';
        $scope.text = '';
        $scope.lineno = 1;

        $scope.write = function(output) {
          $scope.text += output;
        };

        $scope.writeln = function(line) {
          _(line.split('\n')).each(function(_line) {
            $scope.write(_line + '\n');
            $scope.lineno += 1;
          });
        };

        _(_(100).range()).each(function() {
          $scope.write('0|* -> apply: output(CONTROLLER); goto forward;\n');
        });

      }
    };
  });

