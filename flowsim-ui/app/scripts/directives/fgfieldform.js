'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgFieldForm
 * @description
 * # fgFieldForm
 */
angular.module('flowsimUiApp')
  .directive('fgFieldForm', function (Protocols) {
    return {
      templateUrl: 'views/fgfieldform.html',
      require: '?ngModel',
      restrict: 'E',
      scope: {
        protocol: '@',
        field: '@'
      },
      link: function(scope, iElement, iAttrs, ngModelCtrl) {
        var protofield = {}; 

        scope.configField = function(){
          scope.noProtoField = Protocols.getField(scope.protocol, scope.field);
        
          var toView = function(model){
            return {
              value: scope.noProtoField.dispStr(model, 16)
            };
          };

          var toModel = function(value){
            if(!scope.noProtoField.testStr(value.value)){
              ngModelCtrl.$setValidity('validField', false);
              return scope.localValue;
            } else {
              ngModelCtrl.$setValidity('validField', true);
              return scope.noProtoField.consStr(value.value);
            }
          };

          ngModelCtrl.$formatters[0] = toView;
          ngModelCtrl.$parsers[0] = toModel;

          ngModelCtrl.$render = function(){
            scope.localValue = ngModelCtrl.$viewValue.value;
          };

          if(!ngModelCtrl.$isEmpty(scope.localValue)){
            ngModelCtrl.$render(); 
          }
        };


       scope.updateField = function(){
          if(!scope.noProtoField.testStr(scope.localValue)){
            ngModelCtrl.$setViewValue({value: scope.localValue});
          } else {
            ngModelCtrl.$setValidity('invalidField', true);
          }
        };

       scope.$watch(function(){
            protofield.field = scope.localValue;
            protofield.protocol = scope.protocol;
            protofield.field = scope.field;
            return protofield;
        }, function(value) {
            if(scope.protocol && scope.field){
              scope.configField();
            }
        }, true);
      }
    };
  });
