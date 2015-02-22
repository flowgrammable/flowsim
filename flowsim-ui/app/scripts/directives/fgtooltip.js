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
      template: '<span tooltip="test" tooltip-delay="0" tooltip-placement="right" tooltip-trigger="click"'+
       'style="padding-left: 5px;" class="glyphicon glyphicon-question-sign"></span>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
