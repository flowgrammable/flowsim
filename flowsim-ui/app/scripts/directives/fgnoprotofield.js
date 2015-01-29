'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgfieldform2
 * @description
 * # fgfieldform2
 */
angular.module('flowsimUiApp')
  .directive('fgNoprotoField', function () {
    return {
      templateUrl: 'views/fgnoprotofield.html',
      restrict: 'E',
      transclude: false,
      replace: false,
      scope: {
        field: '=',
        setDirty: '&'
      },
      link: function postLink(scope, element) {
        scope.local = {};

        scope.isHexStr = function(input){
          return /0[xX][0-9a-fA-F]+/.test(input);
        };

        if(scope.field.defDisplay === 'hex'){
          scope.field.value.isHex = true;
        }
        scope.local.str = scope.field.valueToString();
        scope.validateField = function(){
          if(scope.field.testStr(scope.local.str)){
            element.removeClass('has-error');
            // Determine user display preference, hex vs dec
            scope.field.value.isHex = scope.isHexStr(scope.local.str);
            scope.field.value.value = scope.field.consStr(scope.local.str);
            scope.setDirty()();
          } else {
            element.addClass('has-error');          
          }
        };

        scope.$watch('field.value.value', function(){
          scope.local.str = scope.field.valueToString();
        });
      }
    };
  });
