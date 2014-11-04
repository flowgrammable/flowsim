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
  function($window, portsView) {
    return {
      restrict: 'EA',
      scope: {
        data: '=',
        label: '@',
        onClick: '&'
      },
      link: function(scope, ele, attrs) {

        //scope._ports = portsView(scope.data.ports, 24);

         scope.isColorA = function(i, j) {
           return j % 2 === 0 && i % 2 === 0 || j % 2 !== 0 && i % 2 !== 0;
         };
           //directive attributes with deafults       
          var margin = parseInt(attrs.margin) || 3,
              portHeight = parseInt(attrs.portHeight) || 20,
              portWidth = parseInt(attrs.portWidth) || 22,
              portPadding = parseInt(attrs.portPadding) || 3;
 
          var svg = d3.select(ele[0])
            .append('svg');
 
          $window.onresize = function() {
            scope.$apply();
          };
 
          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            if(scope._ports) {
              scope.render(scope._ports);
            }
          });
 
          scope.$watch('data', function(newData) {
            if(newData && newData.ports.length) {
            scope._ports = portsView(newData.ports, 24);
            scope.render(scope._ports);
            }
          }, true);
          //Main rendering function. Accept multidimensional array of Port objects.
          scope.render = function(data) {
            svg.selectAll('*').remove();//cleanup 
 
            if (!data) return; //don't render if there is no data
            //dimensions of SVG container
            var height = data.length * portHeight + 3 * margin,
                width = data[0].length * (portWidth + portPadding) +  margin;
            svg.attr('height', height)
              .attr('width', width)
              .attr('class', 'Switch');
                //Add group elements per switch row
            _.each(data, function(row, i) {
                 svg.append('g')
                  .style('width', '100%')
                  .attr('index' , i);
            });

              
            var portsG = svg.selectAll('g')
                .data(data)
                .selectAll('g')
                .data(function(d) { return d; }) 
                .enter()
                .append('g')
                .on('click', function(d) {
                  return scope.onClick({item: d});
                })
                .attr('height', portHeight)
                .attr('width', portWidth)
                .attr('class', function(d, i) {
                  return (scope.isColorA(this.parentNode.attributes.index.value,i)?'PortColorA':'PortColorB');
                })
                .style('opacity', function(d) {
                  return d.up?1:0.3;
                })
                .attr('transform', function(d, i) {
                  // Set d.x and d.y here so that other elements can use it.
                  d.x = i * (portWidth + portPadding) + margin;
                  d.y = this.parentNode.attributes.index.value * (portHeight + portPadding) + margin;
                    return 'translate(' + d.x + ',' + d.y + ')'; 
                });
//Copper shape
                portsG.filter(function(d) {
                  return d.medium === 'Copper';
                })
                .append('rect')
                .attr('height', portHeight * 0.85)
                .attr('width', portWidth)
                .attr('ry', 2)
                .attr('y', portHeight * 0.15);

                portsG.filter(function(d) {
                  return d.medium === 'Copper';
                })
                .append('rect')
                .attr('height', portHeight * 0.15)
                .attr('width', portWidth * 0.4)
                .attr('x', portWidth * 0.3);
                  
//Fiber Shape
                portsG.filter(function(d) {
                  return d.medium === 'Fiber';
                })
                .append('rect')
                .attr('height', portHeight * 0.8)
                .attr('width', portWidth / 2 -1)
                .attr('ry', 2)
                .attr('y', portHeight * 0.15);

                portsG.filter(function(d) {
                  return d.medium === 'Fiber';
                })
                .append('rect')
                .attr('height', portHeight * 0.8)
                .attr('width', portWidth / 2 -1)
                .attr('ry', 2)
                .attr('y', portHeight * 0.15)
                .attr('x', portWidth / 2 + 2);
                  
                portsG.filter(function(d) {
                  return d.medium === 'Fiber';
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
                .text(function(d) {
                  return d.port_id;
                });
          };
        
      }};
}]);
