'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgLabelInput
 * @description
 * # fgLabelInput
 */
angular.module('flowsimUiApp')
  .directive('fgLabelInput', function () {
    return {
      templateUrl: 'views/fglabelinput.html',
      restrict: 'E',
      scope: {
        item: '='
      }
    };
  });
