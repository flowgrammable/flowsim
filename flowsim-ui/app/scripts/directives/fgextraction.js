'use strict';

/**
 * @ngdoc directive for Simulation Extraction View Animation
 * @name flowsimUiApp.directive:fgextraction
 * @description
 * # fgextraction
 */
angular.module('flowsimUiApp')
    .directive('fgExtraction', function() {
        return {
            replace: true,
            restrict: 'EA',
            scope: {
                ctx: '='
            },
            link: function postLink(scope, element, attrs) {
            	var width = parseInt(attrs.width) || 370,
                        height = parseInt(attrs.height) || 70,
                        animationDuration = parseInt(attrs.animationDuration) || 500;

            	scope.protocols;
            	scope.keys;
                scope.init = function() {
                    
                    var container = d3.select(element[0])
                        .append('div')
                        .attr('class', 'ext-container');
                    var firstRow = container.append('div').attr('class', 'ext-row');
                    var secondRow = container.append('div').attr('class', 'ext-row');
                    var packetHolderCell = firstRow.append('div').attr('class', 'ext-left');
                    scope.arrowsCell = secondRow.append('div').attr('class', 'ext-left');
                    var contextKeyCell = secondRow.append('div').attr('class', 'ext-right');
                    //Packet Section
                    var packetWrapper = packetHolderCell
                        .append('div')
                        .attr('id', 'packetIndicator')

                    .attr('class', 'rnn-holder ctx-key-context')
                        .text('Decoder');

                    var pack = packetWrapper.append('div')
                        .attr('class', 'rnn-stack');

                    scope.protocols = pack.selectAll('.rnn-item')
                        .data(scope.ctx.packet.protocols)
                        .enter()
                        .append('div')
                        .attr('class', 'rnn-item ext-pack-header');


                    scope.protocols.append('div')
                        .attr('class', 'rnn-title')
                        .text(function(d) {
                            return d.name;
                        });
                    //END - Packet Section

                    //Context Key Section
                    var ctxRoot = contextKeyCell.append('div');
                    ctxRoot.append('div').attr('class', 'ctx-key-context').text('Context');
                    var ctxHeader = ctxRoot.append('div').attr('class', 'ctx-key-header');
                    ctxHeader.append('div').attr('style', 'padding-left:10px').text('Key');
                    scope.keyWrapper = ctxHeader.append('div');
                    scope.addKey();
                };
                scope.addKey = function() {


                    var keys = scope.keyWrapper.selectAll('#ext-ctx-key-keys')
                        .data(scope.ctx.key)
                        .enter()
                        .insert('div', ':first-child')
                        .attr('id', 'ext-ctx-key-keys')
                        .attr('class', function(d, i) {
                            var cls = i % 2 ? 'ctx-key-color-prim' : 'ctx-key-color-sec';
                            return 'ctx-key-keys ' + cls;
                        })
                        .attr('style', 'opacity: 0');

                    keys.append('div').selectAll('#ext-ctx-key-td')
                        .data(function(d) {
                            return d.attrs;
                        })
                        .enter()
                        .append('div')
                        .attr('id','ext-ctx-key-td')
                        .attr('class', 'ctx-key-td')
                        .text(function(d) {
                            return d.name + ' : ' + d.value;
                        });
                    keys.append('div').attr('class', 'ctx-key-name').text(function(d) {
                        return d.name;
                    });
                    keys.transition().delay(animationDuration)
                        .duration(animationDuration).
                    attr('style', 'opacity: 1');
                };

                //END - Context Key Section
                //connect

                scope.addConnect = function() {
                    var keys = scope.keyWrapper.selectAll('#ext-ctx-key-keys');
                    var le = keys[0].length - 1;
                    var data = [];
                    var protLength = scope.protocols[0].length;
                    for (var i = 0, len = le; i < len; i++) {
                    	var kdiv = keys[0][le - i - 1];
                    	var height = kdiv.offsetTop - kdiv.parentNode.parentNode.parentNode.offsetTop + 22;
                      var width = scope.protocols[0][i].parentNode.clientWidth - scope.protocols[0][i].offsetLeft + scope.protocols[0][i].offsetParent.offsetLeft - (scope.protocols[0][i].clientWidth / 2) + 6;
                        var dim = {
                            h: height,
                            w: width
                        };
                        data.push(dim);
                    }


                    scope.arrowsCell.selectAll('.ext-connect').remove();
                    scope.arrowsCell.selectAll('.ext-connect')
                        .data(data)
                        .enter()
                        .append('div')
                        .attr('class', 'ext-connect')
                        .attr('style', function(d) {
                            var style = 'width:' + d.w + 'px ; height:' + d.h + 'px';
                            return style;
                        });
                }

                //end connect
                scope.$watch('ctx', function(newData) {

                    if (!_.isUndefined(newData) && newData !== null) {
                        if (newData.key.length === 1) {
                            scope.init();
                        } else if (newData.key.length > 1) {
                            scope.protocols.filter(function(d, i) {
                                    return i == newData.key.length - 2; //select only prot by index (-2 due to initial size of array is 1)
                                })
                                .transition().delay(animationDuration)
                                .duration(animationDuration)
                                .attr('class', 'rnn-item ext-pack-header-vis');
                            scope.addKey();
                            scope.addConnect();
                        }

                    }else{
                    	d3.select('.ext-container').remove();
                    }

                }, true);


            }
        };
    });
