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
                makeTransition: '=',
                label: '@'
            },
            link: function postLink(scope, element, attrs) {
                //directive attributes with defaults
                var width        = parseInt(attrs.width) || 630,
                    height       = parseInt(attrs.height) || 100,
                    stageWidth   = parseInt(attrs.stageWidth) || 90,
                    stageHeight  = parseInt(attrs.stageHeight) || 30,
                    stagePadding = parseInt(attrs.stagePadding) || 30,
                    margin       = parseInt(attrs.margin) || 30,
                    animationDuration = parseInt(attrs.animationDuration) || 1500;

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
                var currentStage = -1;
                scope.$watch('makeTransition', function ( newData) {
                    scope.transition(newData.to, newData.clonePacket);
                }, false);
                /**
                 *
                 * @param to - int - index to make transition to
                 * @param clone -boolean - Copy packet and transition one forward
                 */
                scope.transition = function(to, clone){
                    console.log('Transition:'+ clone +' ' + to);
                    if(clone){
                         svg.select('#packets')
                            .append('rect')
                            .attr('class', 'sim-packet')

                            .attr('height', stageHeight + 10)
                            .attr('width', stageWidth + 10)
                            .attr('x', to * (stageWidth + stagePadding) + margin - 5)
                            .attr('y', margin / 2 - 5)
                            .attr('ry', 10)
                            .transition()
                            .duration(animationDuration)
                            .attr('x', 5 * (stageWidth + stagePadding) + margin + 5)
                            ;
                    }else
                    if(to>-1){
                        if(to > currentStage){//forward transition
                          svg.selectAll('.sim-packet')
                            .transition()
                            .style('display', 'block')
                            .duration(animationDuration)
                            .attr('x', to * (stageWidth + stagePadding) + margin + ((to===5)?5:-5));
                        }else{//bacward transition
                            svg.selectAll('.sim-packet')
                            .transition()
                            .duration(animationDuration / 3)
                            .style('display', 'block')
                            .attr('y', height - margin - 15)
                            .transition()
                            .attr('x', to * (stageWidth + stagePadding) + margin - 5)
                            .transition()
                            .attr('y',  margin / 2 - 5);
                        }
                    }else{
                        svg.selectAll('.sim-packet')
                        .style('display', 'none')
                        .attr('x', to * (stageWidth + stagePadding) + margin - 5);
                    }
                    currentStage = to;
                    
                };
                /**
                 * Main rendering function. Accept Stages object.
                 * @param stages - stages array
                 */
                scope.render = function(stages, transitions) {

                    svg.selectAll('g').remove();//cleanup

                    if (_.isUndefined(stages) || !stages || stages.length === 0) {
                      return; //don't render if there is no data
                    }
               //Place holder for Active
                svg.append("g").attr("id", "packets");
                svg.append("g").attr("id", "stages");
                var packet= svg.select('#packets')
                    .append('rect')
                    .attr('class', 'sim-packet')
                    // .style('display', 'none')
                    .attr('height', stageHeight + 10)
                    .attr('width', stageWidth + 10)
                    .attr('x', - 100)
                    .attr('y', margin / 2 - 5)
                    .attr('ry', 10);

                    var stages = svg.select('#stages').selectAll('g')
                        .data(stages)
                        .enter()
                        .append('g')
                        .attr("id", "stages")
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
                                    var y2 = height - margin/2 -10;
                                    return [x1,y1 , x1, y2, x2,y2, x2, y1 ];
                                }

                            })
                            .style("stroke", "black").style("fill","none").attr("stroke-width", 2).attr("marker-end", "url(#arrow)");
                

                };
                scope.render(scope.stages, scope.transitions);
            }};

    });
