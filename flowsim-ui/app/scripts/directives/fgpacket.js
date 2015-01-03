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
      controller: function($scope, $rootScope) {
        $scope.loaded = false;
        $scope.nodeType = '';  // input type to create node
        $scope.options  = {};  // input select options

       $scope.addProtocol = function() {
          $scope.packet.pushPayload($scope.nodeType);
          $scope.nodeType = '';
          $scope.setOptions();
          $rootScope.$broadcast('dirtyCache');
       }

       $scope.popProtocol = function() {
          $scope.packet.popPayload();
          $scope.setOptions();
          $rootScope.$broadcast('dirtyCache');
       }

       $scope.setOptions = function() {
        $scope.options = _.values(Protocols.Payloads[$scope.packet.protocols[$scope.packet.protocols.length - 1].name])[0];
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
        }
        if($scope.packet){
          $scope.loaded = true;
          $scope.setOptions(); 
        }
      }, true);

      }
    };
  });
