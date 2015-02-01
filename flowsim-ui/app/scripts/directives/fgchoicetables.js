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
                  scope.tableNo = scope.data===0?1:scope.data;
                  scope.transition(scope.data);

              }else{
                  scope.tableNo = 0;
                  scope.reset ();
              }
          }, true);

          scope.transition = function(tblNo) {
              d3.selectAll('.choice-tbl')
                  .transition().delay(animationDuration)
                  .duration(animationDuration)
                  .attr('style', 'opacity:0.5');
              var selection = tblNo === 0? '#tbl4':'#tbl3';
               d3.select(selection)
                  .transition().delay(animationDuration)
                  .duration(animationDuration)
                  .attr('style', 'left:500px');
              d3.select('.choice-arrow')
                  .transition().delay(animationDuration/2)
                  .duration(animationDuration)
                  .attr('style', 'width:515px');


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
