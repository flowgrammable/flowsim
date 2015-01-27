'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:inputTrace
 * @description
 * # inputTrace
 */
angular.module('flowsimUiApp')
  .directive('inputTrace', function () {
    return {
      templateUrl: 'views/inputTrace.html',
      restrict: 'E',
      scope: {
        pktEvents: '=',
        resources: '=',
        logPorts: '=',
        phyPorts: '=',
        addPacket: '&'
      },
      controller: function($scope) {
        $scope.active = {};

        $scope.addEvent = function() {
          $scope.pktEvents.push($scope.addPacket()($scope.active));
          $scope.active = {};
        };

        $scope.delEvent = function(idx) {
          $scope.pktEvents.splice(idx, 1);
        };

      }
    };
  });
