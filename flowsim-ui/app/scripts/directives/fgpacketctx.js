'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgPacketCtx
 * @description
 * # fgPacketCtx
 */
angular.module('flowsimUiApp')
    .directive('fgPacketCtx', function () {
        return {
            templateUrl: 'views/simulation/fgpacketctx.html',
            replace: true,
            scope: {
                view: '=',
                packet: '='
            },
            restrict: 'E',
            link: function (scope) {

                scope.$watch('view', function(){
                    if(_.isNull(scope.view)){
                        scope.actionSet = null;
                    }
                }, true);

                scope.$watch('view.actionSet', function () {
                    if(scope.view){
                        if((_.isUndefined(scope.actionSet) || _.isNull(scope.actionSet)) && !(_.isUndefined(scope.view.actionSet))){
                            scope.actionSet = _.clone(scope.view.actionSet);
                        }else {
                            if(scope.view.actionSet > scope.actionSet){
                                _.each(scope.view.actionSet, function(el){
                                    if(!_.some(scope.actionSet, {value1: el.value1, value2: el.value2})){
                                        scope.actionSet.push(el);
                                    }
                                });
                            }else if(scope.view.actionSet < scope.actionSet) {
                                _.each(scope.actionSet, function(el, idx){
                                    if(_.isUndefined(el)){
                                        return;
                                    }
                                    if(!_.some(scope.view.actionSet, {value1: el.value1, value2: el.value2})){
                                        scope.actionSet.splice(idx,1);
                                    }
                                });
                            }
                        }
                    }
                }, true);
            }
        };
    });
