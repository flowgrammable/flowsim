angular.module('flowsimUiApp')
  .directive('fgPacketView', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/fgpacketview.html',
      replace: true,
      scope: {
        'stackData': '=netstructure'
      },
      link: function(scope) {
        var fieldLineHeight = 12; //pixels
        scope.$watch('stackData', function(){
          var curFieldBlockYOffsetLines, i;
          curFieldBlockYOffsetLines = 3;
          for(i=scope.stackData._payload.length-1; i>=0; i--) {
            if (scope.stackData._payload[i].attrs && 
                scope.stackData._payload[i].attrs.length) {
              scope.stackData._payload[i].fieldBlockHeight = 
                scope.stackData._payload[i].attrs.length*fieldLineHeight;
              scope.stackData._payload[i].fieldBlockYOffset = 
                curFieldBlockYOffsetLines*fieldLineHeight + 
                  scope.stackData._payload[i].fieldBlockHeight/2;

              curFieldBlockYOffsetLines += 
                scope.stackData._payload[i].attrs.length+1;
            }
          }
        }, true);
      }
    };
  });
