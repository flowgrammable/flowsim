'use strict';


/**
 * @ngdoc function
 * @name flowsimUiApp.controller:PacketCtrl
 * @description
 * # PacketCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('PacketCtrl', function ($scope, fgCache, Packet, Protocols, $rootScope) {
    // Method to add a new packet

    var packetName = /[a-zA-Z_][a-zA-Z_0-9]*/;

    $scope.names = {};
    $scope.packet   = null;
    $scope.errorMsg = '';
    $scope.dirty = false;

    // get a list of packets
    $scope.getPackets = function(callback) {
      fgCache.getNames('packet', callback);
    };

    // function for constructing a new packet
    $scope.addPacket = function(name) {
      var tmp;
      if(!packetName.test(name)) {
        return 'Bad name';
      } else if(name in $scope.names) {
        return 'Name exists';
      } else {
        $scope.packet = fgCache.create('packet', name, Packet).ui;
        $scope.names[name] = true;
        $scope.dirty = true;
        return '';
      }
    };

    // Method to delete a packet
    $scope.delPacket = function(name) {
      fgCache.destroy('packet', name);
      delete $scope.names[name];
      $scope.dirty = !fgCache.sync();
    };

    // function for changing the focus state of the controller
    $scope.setPacket = function(name) {
      if(name === undefined) {
        $scope.packet = null;
        $scope.$broadcast('setStack', $scope.packet);
      } else {
        fgCache.get('packet', name, Packet, function(err, result) {
          if(err) {
            console.log(err.details);
          } else {
            $scope.packet = result.ui;
            $scope.$broadcast('setStack', $scope.packet);
          }
        });
      }
    };

    $scope.save = function(callback) {
      fgCache.save(function(err, result) {
        if(err) {
          $scope.dirty = true;
          console.log(err.details);
        } else {
          scope.dirty = false;
        }
      });
    };

    $scope.setDirty = function() {
      $scope.dirty = true;
      $scope.packet.dirty = true;
    };

    $scope.getProtocols = function(packet) {
      //return Protocols.getOptions(packet.top().name);
      return Packet.getPayloads(packet.top().name);
    };

    $scope.createProtocol = function(name) {
      return Protocols.createProtocol(name);
    };

  });
