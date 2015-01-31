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
          dispValue: '',
          dispMask: ''
      	};

      	$scope.set = function() {
          $scope.metadata.mkValue($scope.active.value);
          $scope.metadata.mkMask($scope.active.mask);
          $scope.active.value = '';
          $scope.active.mask = '';
      	};
      }
    };
  });
