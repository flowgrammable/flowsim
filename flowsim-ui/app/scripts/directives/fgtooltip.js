'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgtooltip
 * @description
 * # fgtooltip
 */
angular.module('flowsimUiApp')
  .directive('fgTooltip', function () {
    return {
      template: '',
      restrict: 'E',
      scope: {
        show: '=',
        msg: '='
      },
      link: function postLink(scope, element, attrs) {
              scope.tip = scope.msg;
              scope.disp = scope.show;
      }
    };
  });
