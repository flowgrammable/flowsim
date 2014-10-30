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

    // get a list of packets
    $scope.getPackets = function(callback) {
      fgCache.getNames('packet', callback);
    };

    // function for constructing a new packet
    $scope.addPacket = function(name) {
      if(!packetName.test(name)) {
        return 'Bad name';
      } else if(name in $scope.names) {
        return 'Name exists';
      } else {
        $scope.packet = fgCache.create('packet', name, Packet);
        $scope.names[name] = true;
        $scope.setDirty();
        return '';
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
      if(name === undefined) {
        $scope.packet = null;
        $scope.$broadcast('setStack', []);
      } else {
        fgCache.get('packet', name, Packet, function(err, result) {
          if(err) {
            console.log(err.details);
          } else {
            $scope.packet = result;
            $scope.$broadcast('setStack', $scope.packet.protocols);
          }
        });
      }
    };

    $scope.setDirty = function() {
      $rootScope.$broadcast('dirtyCache');
    };

    $scope.setClean = function() {
      $rootScope.$broadcast('cleanCache');
    };

    $scope.getProtocols = function(name) {
      return Packet.getPayloads(name);
    };

    $scope.createProtocol = function(name) {
      return Packet.createProtocolUI(name);
    };

  });
