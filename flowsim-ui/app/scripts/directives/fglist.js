'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgList
 * @description
 * # fgList
 */
angular.module('flowsimUiApp')
  .directive('fgList', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the fgList directive');
      }
    };
  });
