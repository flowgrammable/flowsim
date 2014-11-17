'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgPacketBuffer
 * @description
 * # fgPacketBuffer
 */
angular.module('flowsimUiApp')
    .directive('fgPacketBuffer', function() {
        return {

            replace: true,
            restrict: 'E',
            scope: {
                name: '='
            },
            link: function postLink(scope, element, attrs) {
                //directive attributes with defaults
                var width = parseInt(attrs.width) || 370,
                    height = parseInt(attrs.height) || 70,
                    animationDuration = parseInt(attrs.animationDuration) || 1500;


                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('height', height)
                    .attr('width', width)
                    .attr('class', 'ctx-key-header');
                scope.addPacket = function(x, y, fill, name) {
                    var buffer = svg.append('g')
                        .attr("id", "buffer")
                        .attr('transform', 'translate(' + x + ',' + y + ')');

                    buffer.append('rect')
                        .attr('fill', fill)
                        .attr('height', 70)
                        .attr('width', 35);
                    buffer.append('text').style("fill", "white")
                        .style("font-size", "16px")
                        .attr("text-anchor", "middle")
                        .attr("transform", "translate(12,35) rotate(90)").text(name);
                    return buffer;

                }
                for (var i = 0; i < 5; i++) {
                    var x = (i * 35 + 200);
                    var y = 0;
                    var fill = i % 2 ? '#c0224e' : '#42a0ba';
                    scope.addPacket(x, y, fill, 'packet');

                }
                scope.$watch('name', function(newData) {
                    if (newData !== null && newData.length > 0) {
                        scope.addPacket(0, 0, '#c0224e', scope.name)
                            .transition()
                            .duration(3000)
                            .attr('transform', 'translate(165,0)');
                        d3.selectAll('.ctx-key-vis')
                            .transition().delay(3000)
                            .duration(1000)
                            .style('opacity', '1')
                    }

                }, false);


            }

        };
    });
