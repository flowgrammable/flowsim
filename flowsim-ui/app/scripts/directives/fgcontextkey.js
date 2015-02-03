'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgContextKey
 * @description
 * # fgContextKey
 */
angular.module('flowsimUiApp')
    .directive('fgContextKey', function() {
        return {
            templateUrl: 'views/simulation/fgcontextkey.html',
            replace: true,
            restrict: 'E',
            scope: {
                ctx: '=',
                header: '='
            },
            link: function(scope){
                scope.$watch('ctx.key', function(){
                    if(!scope.ctx || !scope.ctx.key){
                        return;
                    }
                }, true);
            }
        };
    });
