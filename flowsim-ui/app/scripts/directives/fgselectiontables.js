'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgSelectionTables
 * @description
 * # fgSelectionTables
 */
angular.module('flowsimUiApp')
    .directive('fgSelectionTables', function () {
        return {
            templateUrl: 'views/fgselectiontables.html',
            restrict: 'E',
            scope: {
                data: '=',
                table: '='
            },
            link: function postLink(scope, element, attrs) {
                var animationDuration = parseInt(attrs.animationDuration) || 500;
                scope.matchString = '';
                scope.instructionsString = '';

                scope.parseInstructions = function () {
                    var insListView = '';
                    if (scope.data && scope.data.instructionSet) {
                        _(scope.data.instructionSet).each(function (ins, idx) {
                            insListView += ins.shortName;
                            if (idx < scope.data.instructionSet.length - 1) {
                                insListView += ' / ';
                            }
                        });
                    }
                    return insListView;

                };

                scope.parseMatches = function () {
                    var matches = '';
                    if (scope.data && scope.data.flow && scope.data.flow.match) {
                        _(scope.data.flow.match).each(function (ins, idx) {
                            matches += ins;
                            if (idx < scope.data.flow.match.length - 1) {
                                matches += ', ';
                            }
                        });
                    }
                    return matches;

                };
                scope.$watch('data', function () {

                    if (!_.isUndefined(scope.data) && !_.isNull(scope.data) && !_.isUndefined(scope.data.flow) && !_.isNull(scope.data.flow) && scope.data.flow !== '') {
                        scope.matchString = scope.parseMatches();
                        scope.instructionsString = scope.parseInstructions();
                        var tableId = scope.data.flow.priority === '0' ? 4 : 2;
                        scope.transition(tableId);

                    } else {
                        scope.reset();
                    }
                }, true);
                scope.reset = function () {
                    d3.selectAll('.arrow')
                        .attr('style', '');
                    d3.selectAll('.selection-tbl')
                        .attr('style', '');
                    d3.selectAll('.selection-flow')
                        .attr('style', '');

                };
                scope.transition = function (tblNo) {

                    var selection = tblNo === 4 ? '#sel-tbl4' : '#sel-tbl2';
                    var path = {
                        firstWidth: '60px',
                        secondHeight: '95px',
                        thirdTop: '130px',
                        thirdWidht: '350px',
                        fourthTop: '130px',
                        fourthHeight: '110px'
                    };
                    if (tblNo === 4) {
                        path.secondHeight = '135px';
                        path.thirdTop = '170px';
                        path.fourthTop = '170px';
                        path.fourthHeight = '70px';
                        d3.select('#arrow3')
                            .attr('style', 'top:' + path.thirdTop);
                        d3.select('#arrow4')
                            .attr('style', 'top:' + path.fourthTop);
                    }
                    d3.select(selection)
                        .transition().delay(animationDuration*4)
                        .duration(animationDuration)
                        .attr('style', 'opacity:0.3');
                    d3.select('.selection-flow')
                        .transition().delay(animationDuration * 5)
                        .duration(animationDuration)
                        .attr('style', 'opacity:1');

                    d3.select('#arrow1')
                        .transition().delay(animationDuration)
                        .duration(animationDuration)
                        .attr('style', 'width:' + path.firstWidth);
                    d3.select('#arrow2')
                        .transition().delay(animationDuration * 2)
                        .duration(animationDuration )
                        .attr('style', 'height:' + path.secondHeight);
                    d3.select('#arrow3')
                        .transition().delay(animationDuration * 3)
                        .duration(animationDuration)
                        .attr('style', 'width:' + path.thirdWidht + ';top:' + path.thirdTop);
                    d3.select('#arrow4')
                        .transition().delay(animationDuration * 4)
                        .duration(animationDuration)
                        .attr('style', 'height:' + path.fourthHeight + ';top:' + path.fourthTop);
                    d3.select('#point')
                        .transition().delay(animationDuration * 5)
                        .duration(animationDuration)
                        .attr('style', 'opacity:1');


                };

            }
        };
    });
