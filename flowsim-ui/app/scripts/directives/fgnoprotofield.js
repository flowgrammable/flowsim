'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgfieldform2
 * @description
 * # fgfieldform2
 */
angular.module('flowsimUiApp')
  .directive('fgNoprotoField', function ($rootScope) {
    return {
      templateUrl: 'views/fgnoprotofield.html',
      restrict: 'E',
      transclude: false,
      replace: false,
      scope: {
        field: '=',
        setDirty: '&'
      },
      link: function postLink(scope, element, attrs, transclude) {
        scope.local = {};

        scope.validateField = function(){
          if(scope.field.testStr(scope.local.str)){
            element.removeClass('has-error');
            scope.field.value.value = scope.field.consStr(scope.local.str);
            scope.setDirty()();
          } else {
            element.addClass('has-error');          
          }
        }

        scope.$watch('field.value.value', function(){
          scope.local.str = scope.field.dispStr(scope.field.value.value, 16);
        }, true);
      }
    };
  });
