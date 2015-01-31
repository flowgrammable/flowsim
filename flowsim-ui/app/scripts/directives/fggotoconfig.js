'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgGotoConfig
 * @description
 * # fgMeterConfig
 */
angular.module('flowsimUiApp')
  .directive('fgGotoConfig', function () {
    return {
      templateUrl: 'views/fggotoconfig.html',
      restrict: 'E',
      scope: {
      	goto_: '=goto',
      	caps: '='
      },
      controller: function($scope) {
      	$scope.active = {
      		value: '',
          error: ''
      	};

      	$scope.set = function() {
          var error = $scope.goto_.tableTest($scope.active.value, $scope.caps);
          if(error.length > 0){
            $scope.active.error = error;
          } else {
            $scope.goto_.target = $scope.active.value;
            $scope.active.value = '';
            $scope.active.error = '';
          }
      	};
      }
    };
  });
