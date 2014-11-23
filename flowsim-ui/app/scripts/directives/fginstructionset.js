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

                    var retVal = ins.name;
                    if (!_.isUndefined(ins.value1) && !_.isNull(ins.value1)) {
                        retVal += '( ' + ins.value1;
                        if (!_.isUndefined(ins.value2) && !_.isNull(ins.value2)) {
                            retVal += ' , ' + ins.value2;
                        }
                        retVal += ' )';
                    }

                    return retVal;
                };

            },
            link: function(scope) {

                scope.$watch('view', function() {

                    if (!scope.view) {
                        return;
                    }
                    scope.applyActionList = _.findWhere(scope.view.instructionSet, {
                        name: 'Apply'
                    }).set;
                    scope.writeActionSet = _.findWhere(scope.view.instructionSet, {
                        name: 'Write'
                    }).set;
                    scope.instrucionList = scope.view.instructionSet;
                    scope.instructions = function() {
                        var instructions = '';
                        scope.view.instructionSet.forEach(function(value , index , arr) {
                            instructions += value.name.substring(0, 1).toLowerCase();
                            if(index < arr.length -1 ){
                                instructions += ' / ';
                            }
                        });
                        return instructions;
                    };
                    


                }, true /*deep watch*/ );
            }
        };
    });
