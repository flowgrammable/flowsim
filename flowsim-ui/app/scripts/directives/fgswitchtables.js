'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgSwitchTables
 * @description
 * # fgSwitchTables
 */
angular.module('flowsimUiApp')
  .directive('fgSwitchTables', function () {
    return {
      templateUrl: 'views/switch/tables.html',
      restrict: 'E',
      replace: false,
      controller: 'SwitchTableCtrl'
    };
  });
