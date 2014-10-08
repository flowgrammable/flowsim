'use strict';

/**
 * @ngdoc function
 * @name flowsimUiApp.controller:PacketCtrl
 * @description
 * # PacketCtrl
 * Controller of the flowsimUiApp
 */
angular.module('flowsimUiApp')
  .controller('PacketCtrl', function ($scope, Packet) {
    // Method to add a new packet

    var packetName = /[a-zA-Z_][a-zA-Z_0-9]*/;
    
    $scope.packets  = {};
    $scope.packet   = null;
    $scope.errorMsg = '';
    
    Packet.get(function(err, result) {
      if(err) {
        $scope.errorMsg = err.message;
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
      }
    };
    
    $scope.addPacket = function(name) {
      var tmp;
      if(!packetName.test(name)) {
        return 'Bad name';
      } else if(name in $scope.packets) {
        return 'Name exists';
      } else {
        $scope.packet = Packet.create(name);
        $scope.packets[name] = $scope.packet;
        return '';
      }
    };

    // Method to delete a packet
    $scope.delPacket = function(name) {
      if(name in $scope.packets) {
        delete $scope.packets[name];
      }
    };
    
  });

