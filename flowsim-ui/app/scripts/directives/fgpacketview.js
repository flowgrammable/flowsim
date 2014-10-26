'use strict';

angular.module('flowsimUiApp')
  .directive('fgPacketView', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/fgpacketview.html',
      replace: true,
      scope: {
        packet: '=',
        width: '@'
      },
      link: function(scope) {
        //Line height in fields block. Should be same as style in css file.
        //.rnn-field { font-size: 12px; }
       
        var i, fieldLineHeight;
        
        fieldLineHeight = 12; //px
               
        scope.$watch('packet', function(){
          if (!scope.packet || !scope.packet._payload) {
            return;
          }
                    
          //Vertical indents between field blocks (text lines count)
          var linesBetweenFieldBlocks = 1;
          
          //Number of lines for moving current box with fields below
          //Initial value for the top block
          var curFieldBlockYOffsetLines = 3;

          //Reverse loop since the top block is at the end
          for(i=scope.packet._payload.length-1; i>=0; i--) {
                        
            //Calculating block width in % (in proportion to bytes)
            scope.packet._payload[i].width = 
              scope.packet._payload[i].bytes()*100.0/scope.packet.bytes();
           
            if (scope.packet._payload[i].attrs && 
                scope.packet._payload[i].attrs.length) {
              
              //Heigh of fields block
              scope.packet._payload[i].fieldBlockHeight = 
                scope.packet._payload[i].attrs.length*fieldLineHeight;

              //Distance from center of fields block down to stack of protocols
              //(height of the connecting line)
              scope.packet._payload[i].fieldBlockYOffset = 
                curFieldBlockYOffsetLines*fieldLineHeight + 
                scope.packet._payload[i].fieldBlockHeight/2;

              //Next block moves down
              curFieldBlockYOffsetLines += 
                scope.packet._payload[i].attrs.length + 
                linesBetweenFieldBlocks;
            }
          }
        }, true /*deep watch*/);
      }
    };
  });
