'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgtabs
 * @description
 * # fgtabs
 */
angular.module('flowsimUiApp')
  .directive('fgTabs', function () {
    return {
      templateUrl: 'views/fgtabs.html',
      transclude: true,
      restrict: 'E',
      scope: {
        items: '=',
      },
      controller: function($scope) {
        $scope.focus = 0;
      }
    };
  });
