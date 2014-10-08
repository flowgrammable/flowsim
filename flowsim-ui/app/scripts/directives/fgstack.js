'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgStack
 * @description
 * # fgStack
 */
angular.module('flowsimUiApp')
  .directive('fgStack', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the fgStack directive');
      }
    };
  });
