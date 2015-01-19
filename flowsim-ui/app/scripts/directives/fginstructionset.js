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

                    var retVal = ins.tip;
                    /*if (!_.isUndefined(ins.) && !_.isNull(ins.value1)) {
                        retVal += '( ' + ins.value1;
                        if (!_.isUndefined(ins.value2) && !_.isNull(ins.value2)) {
                            retVal += ' , ' + ins.value2;
                        }
                        retVal += ' )';
                    } */

                    return retVal;
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

                    scope.instructionList = scope.view.instructionSet;
                    scope.insListView = '';
                    scope.instructions = function() {
                        scope.insListView = '';
                        scope.view.instructionSet.forEach(function(value , index , arr) {
                            scope.insListView += value.name.substring(0, 1).toLowerCase();
                            if(index < arr.length -1 ){
                                scope.insListView += ' / ';
                            }
                        });
                    };
                    


                }, true /*deep watch*/ );
            }
        };
    });
