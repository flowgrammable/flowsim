'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgfieldform2
 * @description
 * # fgfieldform2
 */
angular.module('flowsimUiApp')
  .directive('fgFieldValidation', function (Protocols, UInt) {
    return {
      templateUrl: 'views/fgfieldform2.html',
      restrict: 'E',
      replace: false,
      scope: {
        protocol: '@',
        field: '@',
        str: '=',
        uint: '=',
        tip: '@',
        disabled: '=ngDisabled'
      },
      link: function postLink(scope, element, attrs) {
        var fieldInfo = {};

        scope.local = {};
        scope.getFieldUtils = function(){
          scope.noProtoField = Protocols.getField(scope.protocol, scope.field);
          if(!scope.tip){
            scope.local.tip = scope.noProtoField.tip;
          } else {
            scope.local.tip = scope.tip;
          }
        }

        scope.validateField = function(){
          if(scope.noProtoField.testStr(scope.local.str)){
            scope.local.invalidStr = false;
            if(scope.str){
              scope.str = scope.local.str;
            }
            if(scope.uint){
              scope.uint.value = scope.noProtoField.consStr(scope.local.str);
            }
          } else {
            scope.local.invalidStr = true;
          }
        }

        scope.setDefault = function(){
          if(!scope.str || !scope.uint){
            scope.defaultValue = new UInt.UInt(null, 0, Math.ceil(scope.noProtoField.bitwidth/8));
            scope.local.str = scope.noProtoField.dispStr(scope.defaultValue.value, 16);
          }
        }

        scope.$watch(function(){
          fieldInfo.protocol = scope.protocol;
          fieldInfo.field = scope.field;
          return fieldInfo;
        }, function(value){
          if(scope.protocol && scope.field){
            scope.getFieldUtils();
            scope.setDefault();
            scope.validateField();
            scope.local.disabled = false;
          } else {
            scope.local.disabled = true;
            scope.local.str = '';
          }
        }, true);

        scope.$onDestroy
      }
    };
  });
