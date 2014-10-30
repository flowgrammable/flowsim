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
          if (!scope.packet || !scope.packet.protocols) {
            return;
          }

          //Vertical indents between field blocks (text lines count)
          var linesBetweenFieldBlocks = 1;
          
          //Number of lines for moving current box with fields below
          //Initial value for the top block
          var curFieldBlockYOffsetLines = 3;

          //Reverse loop since the top block is at the end
          for(i=scope.packet.protocols.length-1; i>=0; i--) {
                        
            //Calculating block width in % (in proportion to bytes)
            scope.packet.protocols.width = 
              scope.packet.protocols[i].bytes*100.0/scope.packet.bytes;
           
            if (scope.packet.protocols[i].attrs && 
                scope.packet.protocols[i].attrs.length) {
              
              //Heigh of fields block
              scope.packet.protocols[i].fieldBlockHeight = 
                scope.packet.protocols[i].attrs.length*fieldLineHeight;

              //Distance from center of fields block down to stack of protocols
              //(height of the connecting line)
              scope.packet.protocols[i].fieldBlockYOffset = 
                curFieldBlockYOffsetLines*fieldLineHeight + 
                scope.packet.protocols[i].fieldBlockHeight/2;

              //Next block moves down
              curFieldBlockYOffsetLines += 
                scope.packet.protocols[i].attrs.length + 
                linesBetweenFieldBlocks;
            }
          }
        }, true /*deep watch*/);
      }
    };
  });
