'use strict';

/**
 * @ngdoc directive
 * @name flowsimApp.directive:fgSelectionTables
 * @description
 * # fgSelectionTables
 */
angular.module('flowsimApp')
  .directive('fgSelectionTables', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the fgSelectionTables directive');
      }
    };
  });
