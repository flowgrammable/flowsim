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
          $scope.packet.pushProtocol($scope.nodeType);
          $scope.nodeType = '';
          $scope.setOptions();
          $scope.setDirty()();
       };

       $scope.popProtocol = function() {
          $scope.packet.popProtocol();
          $scope.setOptions();
          $scope.setDirty()();
       };

       $scope.setOptions = function() {
        $scope.options = _.values(Protocols.Payloads[$scope.packet.protocols[$scope.packet.protocols.length - 1].name])[0];
       };

      //FIXME ... this belongs else where
      $scope.calcPayloadBytes = function() {
        if(_.last($scope.packet.protocols).name === 'Payload'){
          var payload = _.last($scope.packet.protocols);
          var payloadSize = payload.fields[0].value.value;
          _.last($scope.packet.protocols).bytes = parseInt( payload.fields[0].dispStr(payloadSize, 10), 16 );
            $scope.packet.bytes = 0;
          _($scope.packet.protocols).each(function(proto){
            $scope.packet.bytes += proto.bytes;
          });
        }
      };

      $scope.$watch('packet', function() {
        // directive runs before controller,
        // using $scope.loaded to determine if ctrl has run
        // need to rework
        if($scope.packet && $scope.loaded){
          $scope.calcPayloadBytes();
        }
        if($scope.packet){
          $scope.loaded = true;
          $scope.setOptions();
        }
      }, true);

      }
    };
  });
