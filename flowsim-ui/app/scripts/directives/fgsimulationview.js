'use strict';

/**
 * @ngdoc directive
 * @name flowsimApp.directive:fgsimulationview
 * @description
 * # fgsimulationview
 */
angular.module('flowsimUiApp')
    .directive('fgSimulationView', function () {

        return {

            restrict: 'E',
            scope: {
                stages: '=',
                transitions: '=',
                label: '@'
            },
            link: function postLink(scope, element, attrs) {
                //directive attributes with defaults
                var width        = parseInt(attrs.width) || 630,
                    height       = parseInt(attrs.height) || 90,
                    stageWidth   = parseInt(attrs.stageWidth) || 90,
                    stageHeight  = parseInt(attrs.stageHeight) || 30,
                    stagePadding = parseInt(attrs.stagePadding) || 30,
                    margin       = parseInt(attrs.margin) || 30;

                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('height', height)
                    .attr('width', width)
                    .attr('class', 'sim-container');

                //Arrow definition
                svg
                .append("svg:defs")
                .append("svg:marker")
                .attr("id", "arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 10)
                .attr("refY", 0)
                .attr("markerUnits", "strokeWidth")
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M 0 -4 L 10 0 L 0 4 z");

                scope.$watch('stages', function ( newData, oldData) {
                    var fromIdx = -1;
                    var i;
                    for (i = 0; i < oldData.length; ++i) {
                       if(oldData[i].active) fromIdx=i;
                    }
                    var toIdx =-1;
                    i=0;
                    for (i = 0; i < oldData.length; ++i) {
                       if(newData[i].active) toIdx=i;
                    }
                    scope.transition(fromIdx, toIdx);
                }, true);

                scope.transition = function(from, to){
                    if(to>-1){
                      svg.selectAll('.sim-packet')
                        .transition()
                        .style('display', 'block')
                        .duration(1500)
                        .attr('x', to * (stageWidth + stagePadding) + margin - 5);
                    }else{
                        svg.selectAll('.sim-packet')
                        .style('display', 'none')
                        .attr('x', to * (stageWidth + stagePadding) + margin - 5);
                    }
                    
                };
                /**
                 * Main rendering function. Accept Stages object.
                 * @param stages - stages array
                 */
                scope.render = function(stages, transitions) {

                    svg.selectAll('g').remove();//cleanup

                    if (_.isUndefined(stages) || !stages || stages.length === 0) return; //don't render if there is no data
               //Place holder for Active
                var packet= svg
                    .append('rect')
                    .attr('class', 'sim-packet')
                    // .style('display', 'none')
                    .attr('height', stageHeight + 10)
                    .attr('width', stageWidth + 10)
                    .attr('x', - 100)
                    .attr('y', margin / 2 - 5)
                    .attr('ry', 10);

                    var stages = svg.selectAll('g')
                        .data(stages)
                        .enter()
                        .append('g')

                        .attr('height', stageHeight)
                        .attr('width', stageWidth)
                        
                        .attr('class', function (d, i) {
                            return (i % 2 === 0 ? 'sim-stage-prim' : 'sim-stage-sec');
                        })
                        
                        .attr('transform', function (d, i) {
                            var x = i * (stageWidth + stagePadding) + margin;
                            var y = margin/2;
                            return 'translate(' + x + ',' + y + ')';
                        });
                        stages.append('rect')
                            .attr('height', stageHeight)
                            .attr('width', stageWidth)
                            .attr('ry', 6)
                            ;
                        stages.append('text')
                            .attr('y', stageHeight /2 + 4)
                            .attr('x', stageWidth /2)
                            .attr('class', 'sim-stage-text')
                            .attr('text-anchor', 'middle')
                            .text(function (d) {
                                return d.label;
                            });
                        svg.selectAll("polyline")
                            .data(transitions)
                            .enter()

                            .append("polyline")
                            .attr("points", function(d, i){
                                if (d.forward) {
                                    var x1 = d.from === null? 0: (d.from +1)* (stageWidth + stagePadding);
                                    var x2 = d.to === null? width : d.to * ( stageWidth + stagePadding) +stagePadding;
                                    var y = margin/2 + stageHeight/2;
                                    return [x1,y , x2, y ] ;}  // <== Add these
                                else{
                                    var x1 =  (d.from +1)* (stageWidth + stagePadding) -stageWidth /2;
                                    var x2 =  d.to * ( stageWidth + stagePadding) +stagePadding + stageWidth /2;
                                    var y1 = margin/2 + stageHeight;
                                    var y2 = height - margin/2 ;
                                    return [x1,y1 , x1, y2, x2,y2, x2, y1 ];
                                }

                            })
                            .style("stroke", "black").style("fill","none").attr("stroke-width", 2).attr("marker-end", "url(#arrow)");
                

                };
                scope.render(scope.stages, scope.transitions);
            }};

    });
