'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgMetadataConfig
 * @description
 * # fgMeterConfig
 */
angular.module('flowsimUiApp')
  .directive('fgMetadataConfig', function () {
    return {
      templateUrl: 'views/fgmetadataconfig.html',
      restrict: 'E',
      scope: {
      	metadata: '=',
      	caps: '='
      },
      controller: function($scope) {
      	$scope.active = {
      		value: '',
          mask: '',
          maskedValue: ''
      	};

      	$scope.set = function() {
          $scope.metadata.mkMaskedValue($scope.active.value, $scope.active.mask);
          $scope.active.maskedValue = $scope.metadata.value;
          $scope.active.value = '';
          $scope.active.mask = '';
      	};
      }
    };
  });
