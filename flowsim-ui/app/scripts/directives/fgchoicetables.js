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
          scope.$watch('data', function(){
              if(scope.data && scope.data.length > 0){
                  scope.transition ();
              }else{
                  scope.reset();
              }
          }, true);

          scope.transition = function() {
              var table = d3.select('#tbl3')
                  .transition().delay(animationDuration)
                  .duration(animationDuration)
                  .attr('style', 'left:500px');
              d3.selectAll('.choice-tbl-fade')
                  .transition().delay(animationDuration)
                  .duration(animationDuration)
                  .attr('style', 'opacity:0.5');

          };
          scope.reset = function() {
              var table = d3.selectAll('.choice-tbl')
                  .attr('style', '');
          };
      }
    };
  });
