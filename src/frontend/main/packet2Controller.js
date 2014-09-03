
var flowsimApp = angular.module('flowsimApp');

function Ethernet() {
  this.src = [0,0,0,0,0,0];
  this.dst = [0,0,0,0,0,0];
  this.ethertype = 0;
}

Ethernet.prototype.bytes = function() {
  return 14;
}

function Packet(name) {
  this.name = name;
  this.protocols = [new Ethernet()];
  this._bytes = this.protocols[0].bytes();
}

Packet.prototype.bytes = function() {
  return this._bytes;
}

Packet.prototype.pushProtocol = function(p) {
  this.protocols.push(p);
  this._bytes += p.bytes();
}

Packet.prototype.popProtocol = function() {
  var tmp = null;
  if(this.protocols.length) {
    tmp = this.protocols.splice(this.protocols.length-1);
    this._bytes -= tmp.bytes();
    delete tmp;
  }
}

var acceptableName = /[a-zA-Z_][a-zA-Z0-9_]*/;

flowsimApp.controller('packet2Controller',
  function($scope) {
    $scope.packets = [];
    $scope.packetName = '';
    $scope.badPacketName = false;
    $scope.focus = -1;

    $scope.shiftFocus = function(pos) {
      $scope.focus = pos;
    }

    $scope.addPacket = function() {
      var pkt = null;
      if(acceptableName.test($scope.packetName)) {
        pkt = new Packet($scope.packetName);
        $scope.focus = $scope.packets.length;
        $scope.packets.push(pkt);
        $scope.packetName = '';
        $scope.badPacketName = false;
      } else {
        $scope.badPacketName = true;
      }
    }

    $scope.delPacket = function(pos) {
      if($scope.focus == pos)
        $scope.focus = -1;
      else if($scope.focus != -1)
        $scope.focus -= 1;
      delete $scope.packets.splice(pos, 1);
    }
  });

