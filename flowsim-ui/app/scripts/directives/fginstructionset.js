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
            link: function(scope, element, attrs) {
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
                    scope.instructions = scope.view.instructionSet.forEach(function(value) {
                        scope.instructions += value.name.substring(0, 1).toLowerCase() + " / ";
                    });


                }, true /*deep watch*/ );
            }
        };
    });
