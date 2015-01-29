'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgMeterConfig
 * @description
 * # fgMeterConfig
 */
angular.module('flowsimUiApp')
  .directive('fgMeterConfig', function () {
    return {
      templateUrl: 'views/fgmeterconfig.html',
      restrict: 'E',
      scope: {
      	meter: '=',
      	meterCaps: '='
      },
      controller: function($scope) {
      	$scope.active = {
      		value: ''
      	};

      	$scope.set = function() {
      		$scope.meter.id = $scope.active.value;
      	};
      }
    };
  });
