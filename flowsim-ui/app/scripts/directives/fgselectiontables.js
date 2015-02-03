'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgSelectionTables
 * @description
 * # fgSelectionTables
 */
angular.module('flowsimUiApp')
  .directive('fgSelectionTables', function () {
    return {
        templateUrl: 'views/fgselectiontables.html',
        restrict: 'E',
        scope: {
            data: '='
        },
        link: function postLink(scope, element, attrs) {
            var animationDuration = parseInt(attrs.animationDuration) || 500;

      }
    };
  });
