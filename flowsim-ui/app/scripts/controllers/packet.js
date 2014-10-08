'use strict';


/**
 * @ngdoc function
 * @name flowsimUiApp.controller:PacketCtrl
 * @description
 * # PacketCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('PacketCtrl', function ($scope, Packet, Protocols) {
    // Method to add a new packet

    var packetName = /[a-zA-Z_][a-zA-Z_0-9]*/;
    
    $scope.packets  = {};
    $scope.packet   = null;
    $scope.errorMsg = '';
    
    Packet.get(function(err, result) {
      if(err) {
        // uncomment to work in rest init
        //$scope.errorMsg = err.message;
        // this is temporary
        $scope.packets['test'] = Protocols.createPacket('test');
        $scope.$broadcast('initList', ['test']);
        $scope.setPacket('test');
        console.log(err.details);
      } else {
        $scope.packets = result.packets;
        $scope.$broadcast('initList', _.map($scope.packets, function(packet) {
          return packet.name;
        }));
      }
    });

    $scope.setPacket = function(name) {
      if(name in $scope.packets) {
        $scope.packet = $scope.packets[name];
        $scope.$broadcast('setStack', $scope.packet);
      } else {
        $scope.packet = null;
      }
    };
    
    $scope.addPacket = function(name) {
      var tmp;
      if(!packetName.test(name)) {
        return 'Bad name';
      } else if(name in $scope.packets) {
        return 'Name exists';
      } else {
        $scope.packets[name] = $scope.packet;
        $scope.setPacket(name);
        return '';
      }
    };

    // Method to delete a packet
    $scope.delPacket = function(name) {
      if(name in $scope.packets) {
        delete $scope.packets[name];
      }
    };

    $scope.getProtocols = function(packet) {
      return Protocols.getOptions(packet.top().name);
    };

    $scope.createProtocol = function(name) {
      return Protocols.createProtocol(name);
    };

    $scope.savePacket = function() {
    };
    
  });

