'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fginstructionset
 * @description
 * # fginstructionset
 */
angular.module('flowsimUiApp')
    .directive('fgInstructionSet', function(Simulation, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'views/simulation/fgpinstructionsview.html',
            replace: true,
            scope: {
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
                var view = Simulation.Simulation.toView();
                $scope.view = {
                    applyActions: _(view.instructionSet).findWhere({name:'Apply'}),
                    writeActions: _(view.instructionSet).findWhere({name:'Write'}),
                    insList: _(view.instructionSet).map(function(ins){
                      return {
                        name: ins.name,
                        shortName: ins.shortName,
                        tip: ins.tip
                      };
                    })
                  };
                $scope.applyActionList = _.clone($scope.view.applyActions);
                $scope.writeActionSet  = _.clone($scope.view.writeActions);
                $scope.instructionList = _($scope.view.insList).map(function(ins){
                    return {
                        name: ins.name,
                        tip: ins.tip
                    };
                });
                $scope.insListShortName = _($scope.view.insList).map(function(ins){
                    return ins.shortName;
                });
                $scope.insSetListApplyIdx = _.indexOf($scope.insListShortName, 'a');
                $scope.insSetListWriteIdx = _.indexOf($scope.insListShortName, 'w');

                $scope.instructions = function() {
                        var insListView = '';
                        _($scope.insListShortName).each(function(ins, idx){
                            insListView += ins;
                            if(idx < $scope.instructionList.length - 1){
                                insListView += ' / ';
                            }
                        });
                        return insListView;
                };
            },
            link: function(scope) {

                $rootScope.$on('stageStep', function(){
                  if(!scope.instructionList.length){
                    return;
                  }

                  switch(scope.instructionList[0].name){
                    case 'Meter':
                    case 'Clear':
                    case 'Metadata':
                    case 'Goto':
                        scope.instructionList.shift();
                        scope.insListShortName.shift();
                        break;
                    case 'Apply':
                        scope.applyActionList.actions.shift();
                        if(!scope.applyActionList.actions.length){
                            scope.instructionList.shift();
                            scope.insListShortName.shift();
                        }
                        break;
                    case 'Write':
                        scope.writeActionSet.actions.shift();
                        if(!scope.writeActionSet.actions.length){
                            scope.instructionList.shift();
                            scope.insListShortName.shift();
                        }
                        break;
                    default:
                        break;
                  }
                    scope.insListView = scope.instructions();
                    scope.insSetListApplyIdx = _.indexOf(scope.insListShortName, 'a');
                    scope.insSetListWriteIdx = _.indexOf(scope.insListShortName, 'w');
                });

            }
        };
    });
