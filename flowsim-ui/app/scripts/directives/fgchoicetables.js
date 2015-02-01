'use strict';

/**
 * @ngdoc directive
 * @name flowsimUiApp.directive:fgChoiceTables
 * @description
 * # fgChoiceTables
 */
angular.module('flowsimUiApp')
  .directive('fgChoiceTables', function () {
    return {
        templateUrl: 'views/fgchoicetables.html',
        restrict: 'E',
        scope: {
            data: '='
        },
      link: function postLink(scope, element, attrs) {
          var animationDuration = parseInt(attrs.animationDuration) || 500;
          scope.firstTable = 0;
          scope.$watch('data', function(){

              if(!_.isUndefined(scope.data) && !_.isNull(scope.data) && scope.data >= 0){
                  scope.firstTable = scope.data===0?1:0;
                  scope.transition();

              }else{
                  scope.firstTable = 0;
                  scope.reset ();
              }
          }, true);

          scope.transition = function() {
               d3.select('#tbl3')
                  .transition().delay(animationDuration)
                  .duration(animationDuration)
                  .attr('style', 'left:500px');
              d3.select('.choice-arrow')
                  .transition().delay(animationDuration)
                  .duration(animationDuration)
                  .attr('style', 'width:515px');
              d3.selectAll('.choice-tbl-fade')
                  .transition().delay(animationDuration)
                  .duration(animationDuration)
                  .attr('style', 'opacity:0.5');

          };
          scope.reset = function() {
               d3.selectAll('.choice-tbl')
                  .attr('style', '');
              d3.select('.choice-arrow')
                  .attr('style', '');
          };
      }
    };
  });
