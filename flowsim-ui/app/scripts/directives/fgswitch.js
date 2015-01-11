'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgSwitch
 * @description
 * # fgSwitch
 */
angular.module('flowsimUiApp')
  .directive('fgSwitch', function (Switch) {
    return {
      templateUrl: 'views/fgswitch.html',
      restrict: 'E',
      scope: {
      	device: '=',
      	setDirty: '&'
      },
      controller: function($scope) {
        $scope.metadata = {
      		tips: Switch.TIPS,
      		tests: Switch.TESTS,
      		ranges: Switch.RANGES
    	};
	    $scope.$watch('device.name', function(){
	    	$scope.$broadcast('initDevice');
	    });
      }
    };
  });
