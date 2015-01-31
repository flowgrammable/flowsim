'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:showTail
 * @description
 * # showTail
 */
angular.module('flowsimUiApp')
  .directive('showTail', function () {
    return function (scope, element, attrs) {
      scope.$watch(function() {
        return element[0].value;
      },
      function() {
        element[0].scrollTop = element[0].scrollHeight;
      });
    };
  });

