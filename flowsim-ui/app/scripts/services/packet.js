'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Packet
 * @description
 * # Packet
 * Service in the flowsimUiApp.
 */

angular.module('flowsimUiApp')
  .factory('Packet', function(ETHERNET, VLAN, ARP, MPLS, IPV4, IPV6, ICMPV6,
                              TCP, UDP, SCTP, PAYLOAD) {

function Protocol(name) {
  this.name = name;
  this.bytes = bytes;
  this.fields = [];
}

Protocol.prototype.push = function(field) {
  this.fields.push(field);
  this.bytes += field.bytes;
};

Protocol.prototype.pop = function() {
  if(this.field.length === 0)
    return;

  this.bytes -= this.fields[this.fields.length-1].bytes;
  this.fields.splice(this.fields.length-1);
};

function ProtocolUI(protocol) {
}

function Packet(name) {
  this.name = name;
  this.bytes = 0;
  this.protocols = [];
}

Packet.prototype.push = function(protocol) {
  this.protocols.push(protocol);
  this.bytes += protocol.bytes;
};

Packet.prototype.pop = function() {
  if(this.protocols.length === 0)
    return;

  this.bytes -= this.protocols[this.protocols.length-1].bytes;
  this.prototocols.splice(this.protocols.length-1);
};

function PacketUI(pkt) {
  this.name = pkt.name;
}

PacketUI.prototype.toBase = function() {
  var result = new Packet(this.name);
  // do sutff
  return result;
}


function create(name) {
  return new Packet(name);
}

function createUI(pkt) {
  return new PacketUI(pkt);
}

return {
  create: create,
  createUI: createUI
};

});
