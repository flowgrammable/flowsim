'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgLabelInput
 * @description
 * # fgLabelInput
 */
angular.module('flowsimUiApp')
  .directive('fgLabelInput', function ($rootScope, Protocols) {
    return {
      templateUrl: 'views/fglabelinput.html',
      restrict: 'E',
      scope: {
        item: '=',
        proto: '@'
      },
      link: function($scope){
        $scope.field = Protocols.getField($scope.proto, $scope.item.name);
        $scope.updateValue = function() {
          if($scope.field.testStr($scope.str)){
            $scope.item.value.value = $scope.field.consStr($scope.str);
            $rootScope.$broadcast('dirtyCache');
          }
        }
        $scope.$watch('item.value.value', function(){
          $scope.str = $scope.field.dispStr($scope.item.value.value, 16);
        }, true);
      }
    };
  });
