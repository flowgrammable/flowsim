'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fginstructionset
 * @description
 * # fginstructionset
 */
angular.module('flowsimUiApp')
    .directive('fgInstructionSet', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/simulation/fgpinstructionsview.html',
            replace: true,
            scope: {
                view: '='
            },
            controller: function($scope) {
                /**
                 * Parses Instruction and return name:(value1, value2)
                 * @param  {[Instruction Object]} val
                 * @return {[String]}     [name:(value1, value2)]
                 */
                $scope.instructionsTooltip = function(ins) {
                    var tip = '';
                    if(ins.tip){
                        tip += ins.tip;
                    }
                    if(ins.value){
                        tip += '\n Set to ';
                        tip += ins.value;
                    }
                    return tip;

                };

            },
            link: function(scope) {

                scope.$watch('view', function() {

                    if (!scope.view) {
                        return;
                    }
                    if(scope.view.instructionSet){
                        scope.applyActionList = _(scope.view.instructionSet).findWhere({name: 'Apply'});
                        if(scope.applyActionList){
                            scope.applyActionList = scope.applyActionList.actions;
                        }
                        scope.writeActionSet = _(scope.view.instructionSet).findWhere({name: 'Write'});
                        if(scope.writeActionSet){
                            scope.writeActionSet = scope.writeActionSet.actions;
                        }
                    }

                    scope.instructionList = _(scope.view.instructionSet).map(function(ins){
                        return ins.name;
                    });

                    scope.insSetListApplyIdx = _.indexOf(scope.instructionList, 'Apply');
                    scope.insSetListWriteIdx = _.indexOf(scope.instructionList, 'Write');
                    scope.insListView = '';
                    scope.instructions = function() {
                        var insListView = '';
                        _(scope.instructionSet).each(function(ins, idx){
                            insListView += ins.name.substring(0, 2).toLowerCase();
                            if(idx < scope.instructionList.length - 1){
                                insListView += ' / ';
                            }
                        });
                        return insListView;
                    };
                    


                }, true /*deep watch*/ );
            }
        };
    });
