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
    $scope.packetNames = [];

    $scope.bodyPacket = {};

    Packet.get(function(err, result) {
      if(err) {
        // uncomment to work in rest init
        //$scope.errorMsg = err.message;
        // this is temporary
        //$scope.packets['test'] = Protocols.createPacket('test');
        $scope.$broadcast('initList', [$scope.bodyPacket.name]);
        $scope.setPacket($scope.bodyPacket.name);
        //console.log(err.details);
      } else {
        $scope.packetNames = result.names;
        $scope.$broadcast('initList', _.map($scope.packetNames, function(name) {
          return name;
        }));


      }
    });

    $scope.loadPacket = function(packet){
      var pack = Protocols.loadPacket(packet);
      $scope.packets[packet.name] = pack;
      $scope.packet = pack;
      $scope.$broadcast('setStack', $scope.packet);
    };

    $scope.setPacket = function(name) {
    if(!$scope.packets[name]) {
        Packet.getDetail(name, function(err, result){
          if(err){
            console.log(err);
          } else {
            $scope.bodyPacket = result;
            $scope.loadPacket($scope.bodyPacket);
          }
        });
      } else {
        $scope.$broadcast('setStack', $scope.packets[name]);
      }
    };

    $scope.addPacket = function(name) {
      var tmp;
      if(!packetName.test(name)) {
        return 'Bad name';
      } else if(name in $scope.packets) {
        return 'Name exists';
      } else {
        $scope.packets[name] = Protocols.createPacket(name);
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
