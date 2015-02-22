'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgSwitch
 * @description
 * # fgSwitch
 */
angular.module('flowsimUiApp')
  .controller('DpCtrl', function (Switch, $scope) {
        $scope.metadata = {
      		tips: Switch.TIPS,
      		tests: Switch.TESTS,
      		ranges: Switch.RANGES
    	};
	    $scope.$watch('device.name', function(){
	    	$scope.$broadcast('initDevice');
	    });
});
