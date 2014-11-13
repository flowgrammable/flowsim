'use strict';


/**
 * @ngdoc function
 * @name flowsimUiApp.controller:PacketCtrl
 * @description
 * # PacketCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('PacketCtrl', function ($scope, fgCache, Packet, $rootScope) {
    // Method to add a new packet

    var packetName = /[a-zA-Z_][a-zA-Z_0-9]*/;

    $scope.names = {};
    $scope.packet   = null;
    $scope.errorMsg = '';
    $scope.options = [];

    // get a list of packets
    $scope.getPackets = function(callback) {
      fgCache.getNames('packet', callback);
    };

    // function for constructing a new packet
    $scope.addPacket = function(name, callback) {
      if(!packetName.test(name)) {
        callback('Bad name');
      } else if(name in $scope.names) {
        callback('Name exists');
      } else {
        $scope.packet = fgCache.create('packet', name, Packet);
        $scope.options = $scope.getProtocols($scope.packet.protocols[0].name);
        $scope.names[name] = true;
        $scope.setDirty();
        callback(null);
      }
    };

    // Method to delete a packet
    $scope.delPacket = function(name) {
      fgCache.destroy('packet', name);
      if(fgCache.isDirty()) {
        $scope.setDirty();
      } else {
        $scope.setClean();
      }
      delete $scope.names[name];
    };

    // function for changing the focus state of the controller
    $scope.setPacket = function(name) {
      var len;
      if(name === undefined) {
        $scope.packet = null;
      } else {
        fgCache.get('packet', name, Packet, function(err, result) {
          if(err) {
            console.log(err.details);
          } else {
            $scope.names[result.name] = true;
            $scope.packet = result;
            len = $scope.packet.protocols.length;
            $scope.options = $scope.getProtocols(
              $scope.packet.protocols[len-1].name);
          }
        });
      }
    };

    $scope.setDirty = function() {
      if($scope.packet !== null) {
        $scope.packet.dirty = true;
        $scope.packet.bytes = 0;
        _.each($scope.packet.protocols, function(value){
          $scope.packet.bytes += value.bytes;
        });
      }
      $rootScope.$broadcast('dirtyCache');
    };

    $scope.setClean = function() {
      $rootScope.$broadcast('cleanCache');
    };

    $scope.getProtocols = function(name) {
      return Packet.getPayloads(name);
    };

    $scope.createProtocol = function(name) {
      var len = $scope.packet.protocols.length;
      if($scope.packet) {
        $scope.packet.protocols[len-1].setPayload(name);
        var protocol = Packet.createProtocolUI(name);
        $scope.packet.protocols.push(protocol);
        $scope.options = $scope.getProtocols(protocol.name);
      }
    };

    $scope.popProtocol = function() {
      var len = $scope.packet.protocols.length;
      if($scope.packet && len > 1) {
        $scope.packet.protocols.splice(len-1, 1);
        $scope.options = $scope.getProtocols(
            $scope.packet.protocols[len-2].name);
      }
    };

  });
