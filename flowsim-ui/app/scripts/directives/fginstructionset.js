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
                    return tip;

                };
            },
            link: function(scope) {
                scope.$watch('view.applyActions', function(){
                    if(scope.view){
                        scope.applyActionList = scope.view.applyActions;
                    }
                }, true);

                scope.$watch('view.writeActions', function(){
                    if(scope.view){
                        scope.writeActionSet = scope.view.writeActions;
                    }
                }, true);

                scope.$watch('view.insList', function(){
                    if(scope.view){
                        scope.instructionList = _(scope.view.insList).map(function(ins){
                            return ins.name;
                        });
                        scope.insListView = scope.instructions();
                        scope.insSetListApplyIdx = _.indexOf(scope.instructionList, 'Apply');
                        scope.insSetListWriteIdx = _.indexOf(scope.instructionList, 'Write');
                    }
                }, true);

                scope.instructions = function() {
                        var insListView = '';
                        _(scope.view.insList).each(function(ins, idx){
                            insListView += ins.shortName;
                            if(idx < scope.instructionList.length - 1){
                                insListView += ' / ';
                            }
                        });
                        return insListView;
                };
            }
        };
    });
