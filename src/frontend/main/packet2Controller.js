
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

function Packets() {
  this.acceptableName = /[a-zA-Z_][a-zA-Z0-9_]*/;
  this.packets = [];
  this.names = {};
}

Packets.prototype.addPacket = function(name) {
  var pkt = null;
  if(name in this.names)
    return 'packetExists';
  if(!this.acceptableName.test(name))
    return 'badPacketName';
  pkt = new Packet(name);
  this.packets.push(pkt);
  this.names[name] = pkt;
  return '';
}

Packets.prototype.delPacketByName = function(name) {
  var i;
  if(name in this.names)
    delete this.names[name];
  for(i=0; i<this.packets.length; ++i) {
    if(name == this.packets[i].name) {
      delete this.packets.splice(i, 1);
      return ;
    }
  }
}

Packets.prototype.delPacketByPos = function(pos) {
  var pkt = null;
  if(pos >= -1 && pos < this.packets.length) {
    if(this.packets[pos].name in this.names) {
      delete this.names[this.packets[pos].name];
    }
    this.packets.splice(pos, 1);
  }
}

Packets.prototype.size = function() {
  return this.packets.length;
}

flowsimApp.controller('packet2Controller',
  function($scope) {
    $scope.packets = new Packets();
    $scope.packetName = '';
    $scope.badPacketName = false;
    $scope.packetExists = false;
    $scope.focus = -1;

    $scope.shiftFocus = function(pos) {
      $scope.focus = pos;
    }

    $scope.addPacket = function() {
      switch($scope.packets.addPacket($scope.packetName)) {
        case 'packetExists':
          $scope.packetExists = true;
          break;
        case 'badPacketName':
          $scope.badPacketName = true;
          break;
        default:
          $scope.badPacketName = false;
          $scope.packetExists = false;
          $scope.packetName = '';
          $scope.focus = $scope.packets.size()-1;
          break;
      }
    }

    $scope.delPacket = function(pos) {
      if($scope.focus == pos)
        $scope.focus = -1;
      else if($scope.focus != -1 && pos <= $scope.focus)
        $scope.focus -= 1;
      $scope.packets.delPacketByPos(pos);
    }
  });

