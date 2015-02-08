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

                scope.$watch('view', function () {
                    if (_.isNull(scope.view)) {
                        scope.actionSet = null;
                    }
                }, true);

                scope.$watch('view.actionSet', function () {
                    if (scope.view) {
                        if ((_.isUndefined(scope.actionSet) || _.isNull(scope.actionSet)) && !(_.isUndefined(scope.view.actionSet))) {
                            scope.actionSet = _.clone(scope.view.actionSet);
                        } else {
                            //Update and/or add missing
                            _.each(scope.view.actionSet, function (el) {
                                var predicate = null;
                                if (el.value1 === 'eth') {//eth action unique key is value1 and value2
                                    predicate = {value1: el.value1, value2: el.value2};
                                } else {
                                    predicate = {value1: el.value1};
                                }
                                var action = _.findWhere(scope.actionSet, predicate);
                                if (_.isUndefined(action)) {
                                    scope.actionSet.push(el);
                                } else {
                                    action.value2 = el.value2;
                                    action.tip = el.tip;
                                }
                            });

                            if(scope.view.actionSet.length === 0){
                                scope.actionSet = [];
                            }else {
                                var idxToRemove = [];
                                var counter = 0;
                                _.each(scope.actionSet, function (el, idx) {
                                    if (!_.some(scope.view.actionSet, {value1: el.value1, value2: el.value2})) {
                                        idxToRemove.push(idx);
                                    }
                                });
                                _.each(idxToRemove, function(index){
                                    scope.actionSet.splice(index - counter, 1);
                                    counter++;
                                });

                            }

                        }
                    }
                }, true);
            }
        };
    });
