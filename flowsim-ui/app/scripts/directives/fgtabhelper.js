'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgtabhelper
 * @description
 * # fgtabhelper
 */
angular.module('flowsimUiApp')
  .directive('fgTabHelper', function () {
    return {
      restrict: 'EA',
      link: function postLink(scope, element) {
 		element.addClass('disabled');
      }
    };
  });
