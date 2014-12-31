'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgLabelInput
 * @description
 * # fgLabelInput
 */
angular.module('flowsimUiApp')
  .directive('fgLabelInput', function ($rootScope) {
    return {
      templateUrl: 'views/fglabelinput.html',
      restrict: 'E',
      scope: {
        item: '='
      },
      link: function($scope){
        $scope.updateValue = function() {
          if($scope.item.testStr($scope.str)){
            $scope.item.value.value = $scope.item.consStr($scope.str);
            $rootScope.$broadcast('dirtyCache');
          }
        }
        $scope.$watch('item.value.value', function(){
          $scope.str = $scope.item.dispStr($scope.item.value.value, 16);
        }, true);
      }
    };
  });
