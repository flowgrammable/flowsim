'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgnoprotomatchfield
 * @description
 * # fgnoprotomatchfield
 */
angular.module('flowsimUiApp')
  .directive('fgNoprotoMatchField', function (Protocols, UInt) {
    return {
      templateUrl: 'views/fgnoprotomatchfield.html',
      restrict: 'E',
      scope: {
        activeMatch: '='
      },
      link: function postLink(scope, element, attrs) {
        var noProtoField;
        scope.uint = {};
        scope.disabled = true;

        scope.validateField = function(){
          if(noProtoField.testStr(scope.activeMatch.value)){
            element.removeClass('has-error');
            scope.uint.value = noProtoField.consStr(scope.activeMatch.value);
            scope.activeMatch.value = noProtoField.dispStr(scope.uint.value, 16);
          } else {
            element.addClass('has-error');
          }
        }
        scope.local = {};
        scope.$watch('activeMatch.protocol + activeMatch.field', function(){
            if(scope.activeMatch.protocol && scope.activeMatch.field){
              noProtoField = Protocols.getField(scope.activeMatch.protocol, scope.activeMatch.field);
              scope.uint = new UInt.UInt(null, 0, Math.ceil(noProtoField.bitwidth/8));
              scope.activeMatch.value = noProtoField.dispStr(scope.uint.value, 16);
              scope.disabled = false;
            } else {
              scope.disabled = true;
            }
        }, true);
      }
    };
  });
