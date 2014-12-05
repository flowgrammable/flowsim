'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgWriteAction
 * @description
 * # fgWriteAction
 */
angular.module('flowsimUiApp')
  .directive('fgWriteAction', function () {
    return {
      templateUrl: 'views/fgWriteAction.html',
      restrict: 'E'
    };
  });
