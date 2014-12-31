'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgLabelInput
 * @description
 * # fgLabelInput
 */
angular.module('flowsimUiApp')
  .directive('fgLabelInput', function () {
    return {
      templateUrl: 'views/fglabelinput.html',
      restrict: 'E',
      scope: {
        item: '='
      },
      link: function($scope){
        console.log('val:', $scope.item.value.value);
        $scope.str = $scope.item.dispStr($scope.item.value.value);
        $scope.updateValue = function() {
          if($scope.item.testStr($scope.str)){
            $scope.item.value.value = $scope.item.consStr($scope.str);
          }
        }
      }
    };
  });
