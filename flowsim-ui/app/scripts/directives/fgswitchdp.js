'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgswitchdp
 * @description
 * # fgswitchdp
 */
angular.module('flowsimUiApp')
  .directive('fgSwitchDp', function () {
    return {
      templateUrl: 'views/switch/datapath.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        
      }
    };
  });
