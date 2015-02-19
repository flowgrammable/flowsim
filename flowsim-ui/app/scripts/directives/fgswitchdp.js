'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgswitchdp
 * @description
 * # fgswitchdp
 */
angular.module('flowsimUiApp')
  .directive('fgSwitchDp', function (Switch) {
    return {
      templateUrl: 'views/switch/datapath.html',
      restrict: 'E',
      controller: function($scope){
      	 $scope.metadata = {
      		tips: Switch.TIPS,
      		tests: Switch.TESTS,
      		ranges: Switch.RANGES
    		};
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
