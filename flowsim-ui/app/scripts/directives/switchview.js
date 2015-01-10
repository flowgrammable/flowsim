'use strict';

/**
 * @ngdoc directive
 * @name switchviewApp.directive:switchview
 * @description Usage <switch-view data='device'></switch-view> will render with defaults. To override use following format:
 <switch-view data='device' margin='10' port-height='42' port-width='44' padding='6'></switch-view>
 * # switchview
 */

angular.module('flowsimUiApp').
    directive('switchView', ['$window', 'portsView',
        function ($window, portsView) {
            return {
                restrict: 'EA',
                scope: {
                    data: '=',
                    label: '@',
                    onClick: '&'
                },
                link: function (scope, ele, attrs) {


                    scope.isColorA = function (i, j) {
                        return j % 2 === 0 && i % 2 === 0 || j % 2 !== 0 && i % 2 !== 0;
                    };
                    //directive attributes with deafults
                    var margin = parseInt(attrs.margin) || 3,
                        portHeight = parseInt(attrs.portHeight) || 20,
                        portWidth = parseInt(attrs.portWidth) || 22,
                        portPadding = parseInt(attrs.portPadding) || 3;

                    var svg = d3.select(ele[0])
                        .append('svg')
                        .attr('height', portHeight + 3 * margin)
                        .attr('width', 0)
                        .attr('class', 'Switch');

                    $window.onresize = function () {
                        scope.$apply();
                    };

                    scope.$watch(function () {
                        return angular.element($window)[0].innerWidth;
                    }, function () {
                        scope.render(scope.data);
                    });

                    scope.$watch('data', function (newData) {
                        //scope.ports = portsView(newData.ports, 24);
                        scope.render(scope.data);
                    }, true);

                    /**
                     * Main rendering function. Accept Device object.
                     * @param data - device object. e.g.{ n_ports: 0, ports: []}
                     */
                    scope.render = function (data) {
                        svg.selectAll('*').remove();//cleanup

                        if (_.isUndefined(data) || !data || data.length === 0) {
                          return; //don't render if there is no data
                        }
                        data = portsView(data.ports, 24);//parse ports and convert to matrix [row][port]

                        //dimensions of the SVG container
                        var height = data.length * portHeight + 3 * margin,
                            width = data[0].length * (portWidth + portPadding) + margin;
                        svg.attr('height', height)
                            .attr('width', width);
                        //Add group elements per switch row
                        _.each(data, function (row, i) {
                            svg.append('g')
                                .style('width', '100%')
                                .attr('index', i);
                        });


                        var portsG = svg.selectAll('g')
                            .data(data)
                            .selectAll('g')
                            .data(function (d) {
                                return d;
                            })
                            .enter()
                            .append('g')
                            .on('click', function (d) {
                                return scope.onClick({item: d});
                            })
                            .attr('height', portHeight)
                            .attr('width', portWidth)
                            .attr('class', function (d, i) {
                                return (scope.isColorA(this.parentNode.attributes.index.value, i) ? 'PortColorA' : 'PortColorB');
                            })
                            .style('opacity', function (d) {
                                return d.state.link_down ? 0.3 : 1;
                            })
                            .attr('transform', function (d, i) {
                                var x = i * (portWidth + portPadding) + margin;
                                var y = this.parentNode.attributes.index.value * (portHeight + portPadding) + margin;
                                return 'translate(' + x + ',' + y + ')';
                            });
//Copper shape
                        portsG.filter(function (d) {
                            return d.ethernet.medium === 'Copper';
                        })
                            .append('rect')
                            .attr('height', portHeight * 0.85)
                            .attr('width', portWidth)
                            .attr('ry', 2)
                            .attr('y', portHeight * 0.15);

                        portsG.filter(function (d) {
                            return d.ethernet.medium === 'Copper';
                        })
                            .append('rect')
                            .attr('height', portHeight * 0.15)
                            .attr('width', portWidth * 0.4)
                            .attr('x', portWidth * 0.3);

//Fiber Shape
                        portsG.filter(function (d) {
                            return d.ethernet.medium === 'Fiber';
                        })
                            .append('rect')
                            .attr('height', portHeight * 0.8)
                            .attr('width', portWidth / 2 - 1)
                            .attr('ry', 2)
                            .attr('y', portHeight * 0.15);

                        portsG.filter(function (d) {
                            return d.ethernet.medium === 'Fiber';
                        })
                            .append('rect')
                            .attr('height', portHeight * 0.8)
                            .attr('width', portWidth / 2 - 1)
                            .attr('ry', 2)
                            .attr('y', portHeight * 0.15)
                            .attr('x', portWidth / 2 + 2);

                        portsG.filter(function (d) {
                            return d.ethernet.medium === 'Fiber';
                        })
                            .append('rect')
                            .attr('height', portHeight * 0.6)
                            .attr('width', portWidth * 0.6)
                            .attr('x', portWidth * 0.2)
                            .attr('y', portHeight * 0.1);


//Text
                        portsG.append('text')
                            .attr('y', 14)
                            .attr('x', 11)
                            .attr('class', 'PortText')
                            .attr('text-anchor', 'middle')
                            .text(function (d) {
                                return d.id;
                            });
                    };

                }};
        }]);
