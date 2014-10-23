'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgGroup
 * @description
 * # fgGroup
 */
angular.module('flowsimUiApp')
  .directive('fgGroup', function () {
    return {
      templateUrl: 'views/fggroup.html',
      restrict: 'E',
      scope: {
        heading: '=',
        elements: '='
      }
    };
  });
