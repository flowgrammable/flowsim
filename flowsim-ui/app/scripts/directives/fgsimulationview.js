'use strict';

/**
 * @ngdoc directive
 * @name flowsimApp.directive:fgsimulationview
 * @description
 * # fgsimulationview
 */
angular.module('flowsimUiApp')
    .directive('fgSimulationView', function() {

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
                var width = parseInt(attrs.width) || 870,
                    height = parseInt(attrs.height) || 100,
                    stageWidth = parseInt(attrs.stageWidth) || 90,
                    stageHeight = parseInt(attrs.stageHeight) || 30,
                    stagePadding = parseInt(attrs.stagePadding) || 30,
                    margin = parseInt(attrs.margin) || 30,
                    animationDuration = parseInt(attrs.animationDuration) || 1500;


                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('height', height)
                    .attr('width', width)
                    .attr('class', 'sim-container');

                //Arrow definition
                svg
                    .append('svg:defs')
                    .append('svg:marker')
                    .attr('id', 'arrow')
                    .attr('viewBox', '0 -5 10 10')
                    .attr('refX', 8)
                    .attr('refY', 0)
                    .attr('markerUnits', 'strokeWidth')
                    .attr('markerWidth', 6)
                    .attr('markerHeight', 6)
                    .attr('orient', 'auto')
                    .append('svg:path')
                    .attr('d', 'M 0 -3 L 8 0 L 0 3 z')
                    .style('stroke', 'black')
                    .style('fill', 'black');
                svg
                    .append('svg:defs')
                    .append('svg:marker')
                    .attr('id', 'backarrow')
                    .attr('viewBox', '0 -5 10 10')
                    .attr('refX', 0)
                    .attr('refY', 0)
                    .attr('markerUnits', 'strokeWidth')
                    .attr('markerWidth', 6)
                    .attr('markerHeight', 6)
                    .attr('orient', 'auto')
                    .append('svg:path')
                    .attr('d', 'M 0 0 L 8 3 L 8 -3 z')
                    .style('stroke', 'black')
                    .style('fill', 'black');
                var currentStage = -1;
                scope.$watch('makeTransition', function(newData) {
                    scope.transition(newData, currentStage);
                    currentStage = (_.isUndefined(newData.to)) ? -1 : newData.to;
                }, false);
                /**
                 * Transition function allows to make transitions of the current packet by providing {to:<stage>}.
                 * If clonePacket: true is provided and to: value equals current position, another packet will be created and transitioned to stage indicated in cloneTo attribute
                 * If there are cloned packets in current stage where original packet is, providing to: currentStage and cloneTo to other stage will transition cloned packect one at the time.
                 * If fade:true provided Current Packet will fade away,
                 * @param  {[Object]} trans  {to: <number>, clonePacket: <bool>,cloneTo:<number>,fade:<bool>}
                 * @param  {[type]} currentStage current stage variable
                 * @return {[type]}
                 */
                scope.transition = function(trans, currentStage) {
                    console.log('Transition:' + JSON.stringify(trans));
                    console.log('CurrentStage:' + currentStage);
                    if (trans.fade) { //dropping the packet
                        svg.selectAll('.sim-packet')
                            .transition()
                            .duration(animationDuration)
                            .style('opacity', '0')
                            .transition();
                    } else
                    if (trans.output){
                        svg.selectAll('.sim-packet')
                            .style('opacity', '.5')
                            .transition()
                            .style('display', 'block')
                            .duration(animationDuration)
                            .attr('x', (trans.to + 1) * (stageWidth + stagePadding) + margin - 5)
                            .transition()
                            .style('display', 'none');
                    } else
                    if (trans.clonePacket) {
                        svg.select('#packets')
                            .append('rect')
                            .attr('class', 'sim-packet-copy')
                            .attr('height', stageHeight + 10)
                            .attr('width', stageWidth + 10)
                            .attr('x', trans.to * (stageWidth + stagePadding) + margin - 5)
                            .attr('y', margin / 2 - 5)
                            .attr('ry', 10)
                            .attr('stage', trans.cloneTo) //set the stage ID
                            .transition()
                            .duration(animationDuration)
                            .attr('x', trans.cloneTo * (stageWidth + stagePadding) + margin - 5)
                            .remove();
                    } else
                    if (trans.to > -1) {
                        if (trans.to > currentStage) { //forward transition
                            console.log('curr stage:', currentStage);
                            console.log('trans to:', trans.to);
                            if(trans.output === true){
                                svg.selectAll('.sim-packet')
                                    .style('opacity', '.5')
                                    .transition()
                                    .style('display', 'block')
                                    .duration(animationDuration)
                                    .attr('x', (trans.to + 1) * (stageWidth + stagePadding) + margin - 5)
                                    .transition()
                                    .style('display', 'none');
                            } else {
                                svg.selectAll('.sim-packet')
                                    .style('opacity', '.5')
                                    .transition()
                                    .style('display', 'block')
                                    .duration(animationDuration)
                                    .attr('x', trans.to * (stageWidth + stagePadding) + margin - 5);
                            }
                        } else if (trans.to === currentStage) { //stay and try to transition first cloned packet from array
                            var currPackets = svg.selectAll('.sim-packet-copy')
                                .filter(function() {
                                    return parseInt(this.getAttribute('stage')) === currentStage;
                                });

                            d3.select(currPackets[0].pop()).transition()
                                .style('opacity', '.5')
                                .style('display', 'block')
                                .duration(animationDuration)
                                .attr('stage', trans.cloneTo)
                                .attr('x', trans.cloneTo * (stageWidth + stagePadding) + margin - 5);
                        } else { //bacward transitio
                            svg.selectAll('.sim-packet')
                                .style('opacity', '.5')
                                .transition()
                                .duration(animationDuration / 3)
                                .style('display', 'block')
                                .attr('y', height - margin - 15)
                                .transition()
                                .attr('x', trans.to * (stageWidth + stagePadding) + margin - 5)
                                .transition()
                                .attr('y', margin / 2 - 5);
                        }
                    } else {
                        svg.selectAll('.sim-packet')
                            .style('display', 'none')
                            .attr('x', trans.to * (stageWidth + stagePadding) + margin - 5);
                    }


                };
                /**
                 * Main rendering function. Accept Stages object.
                 * @param stages - stages array
                 */
                scope.render = function(stages, transitions) {

                    svg.selectAll('g').remove(); //cleanup

                    if (_.isUndefined(stages) || !stages || stages.length === 0) {
                        return; //don't render if there is no data
                    }
                    //Place holder for Active
                    svg.append('g').attr('id', 'packets');
                    svg.append('g').attr('id', 'stages');
                    svg.select('#packets')
                        .append('rect')
                        .attr('class', 'sim-packet')

                    .attr('height', stageHeight + 10)
                        .attr('width', stageWidth + 10)
                        .attr('x', -100)
                        .attr('y', margin / 2 - 5)
                        .attr('ry', 10);

                    stages = svg.select('#stages').selectAll('g')
                        .data(stages)
                        .enter()
                        .append('g')
                        .attr('id', 'stages')
                        .attr('height', stageHeight)
                        .attr('width', stageWidth)

                    .attr('class', function(d, i) {
                        return (i % 2 === 0 ? 'sim-stage-prim' : 'sim-stage-sec');
                    })

                    .attr('transform', function(d, i) {
                        var x = i * (stageWidth + stagePadding) + margin;
                        var y = margin / 2;
                        return 'translate(' + x + ',' + y + ')';
                    });
                    stages.append('rect')
                        .attr('height', stageHeight)
                        .attr('width', stageWidth)
                        .attr('ry', 6);
                    stages.append('text')
                        .attr('y', stageHeight / 2 + 4)
                        .attr('x', stageWidth / 2)
                        .attr('class', 'sim-stage-text')
                        .attr('text-anchor', 'middle')
                        .text(function(d) {
                            return d.label;
                        });
                    svg.selectAll('polyline')
                        .data(transitions)
                        .enter()

                    .append('polyline')
                        .attr('points', function(d) {
                            var x1, x2, y1, y2, y;
                            if (d.forward) {
                                x1 = d.from === null ? 0 : (d.from + 1) * (stageWidth + stagePadding);
                                x2 = d.to === null ? width : d.to * (stageWidth + stagePadding) + stagePadding;
                                y = margin / 2 + stageHeight / 2;
                                return [x1, y, x2, y];
                            } // <== Add these
                            else {
                                x1 = (d.from + 1) * (stageWidth + stagePadding) - stageWidth / 2;
                                x2 = d.to * (stageWidth + stagePadding) + stagePadding + stageWidth / 2;
                                y1 = margin / 2 + stageHeight;
                                y2 = height - margin / 2 - 10;
                                return [x1, y1, x1, y2, x2, y2, x2, y1];
                            }

                        })
                        .style('stroke', 'black')
                        .style('fill', 'none')
                        .attr('stroke-width', 2)
                        .attr('marker-end', 'url(#arrow)')
                        .attr('marker-start', function(d) {
                            return d.biDirectional ? 'url(#backarrow)' : '';
                        });


                };
                scope.render(scope.stages, scope.transitions);
            }
        };

    });
