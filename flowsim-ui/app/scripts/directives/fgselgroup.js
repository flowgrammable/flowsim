'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgSelGroup
 * @description
 * # fgSelGroup
 */
angular.module('flowsimUiApp')
  .directive('fgSelGroup', function () {
    return {
      templateUrl: 'views/fgselgroup.html',
      restrict: 'E',
      scope: {
        heading: '=',
        elements: '='
      },
      controller: function($scope) {
        $scope.toggleElem = function(idx) {
          $scope.elements[idx].visible = !$scope.elements[idx].visible;
        };
      }
    };
  });
