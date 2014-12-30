'use strict';


angular.module('flowsimUiApp')
  .directive('fgPacket', function (Protocols) {

    return {
      restrict: 'E',                      // HTML Element
      transclude: true,                   // Copy element body in
      templateUrl: 'views/fgpacket.html',  // Location of template
      scope: {
        packet: '=',
        setDirty: '&'      // callback for persisting changes
      },
      controller: function($scope) {
        $scope.loaded = false;
        $scope.nodeType = '';  // input type to create node
        $scope.options  = {};  // input select options

       $scope.addProtocol = function() {
          var tmp = _(Protocols.Protocols).find(function(proto){
            return $scope.nodeType === proto.name;
          });
          $scope.packet.push(tmp);
          console.log($scope.packet);
          $scope.nodeType = '';
       }

       $scope.popProtocol = function() {
          $scope.packet.pop();
       }

      //FIXME ... this belongs else where
      $scope.calcPayloadBytes = function() {
        if($scope.stack && $scope.stack.slice(-1)[0].name === 'Payload'){
          val = parseInt($scope.stack.slice(-1)[0].attrs[0].value);
          if(isNaN(val)){
            $scope.stack.slice(-1)[0].bytes = 0;
          } else {
            $scope.stack.slice(-1)[0].bytes = val;
          }
        }
      };

      $scope.$watch('packet', function() {
        // directive runs before controller,
        // using $scope.loaded to determine if ctrl has run
        // need to rework
        if($scope.loaded){
          $scope.calcPayloadBytes();
          $scope.setDirty()();
        }
        if($scope.packet){
          $scope.loaded = true;
          $scope.options = _.values(Protocols.Payloads[$scope.packet.protocols[$scope.packet.protocols.length - 1].name])[0];
        }
      }, true);

      }
    };
  });
