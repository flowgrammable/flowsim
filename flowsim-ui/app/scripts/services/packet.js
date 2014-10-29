'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Packet
 * @description
 * # Packet
 * Service in the flowsimUiApp.
 */

angular.module('flowsimUiApp')
  .factory('Packet', function(ETHERNET, VLAN, ARP, MPLS, IPV4, IPV6, ICMPV4,
                            ICMPV6, TCP, UDP, SCTP, PAYLOAD) {

var Protocols = {
  Ethernet: ETHERNET,
  VLAN: VLAN,
  ARP: ARP,
  MPLS: MPLS,
  IPv4: IPV4,
  ICMPv4: ICMPV4,
  ICMPv6: ICMPV6,
  TCP: TCP,
  UDP: UDP,
  SCTP: SCTP,
  Payload: PAYLOAD
};

function dispatch(name, method) {
  console.log('dispatch name:', name);
  console.log('name length', name.length);
  switch(name) {
    case ETHERNET.name:
      console.log('hit ethernet case');
      return ETHERNET[method]();
    case VLAN.name:
      return VLAN[method]();
    case MPLS.name:
      return MPLS[method]();
    case ARP.name:
      return ARP[method]();
    case IPV4.name:
      return IPV4[method]();
    case IPV6.name:
      return IPV6[method]();
    case ICMPV4.name:
      return ICMPV4[method]();
    case ICMPV6.name:
      return ICMPV6[method]();
    case TCP.name:
      return TCP[method]();
    case UDP.name:
      return UDP[method]();
    case SCTP.name:
      return SCTP[method]();
    case PAYLOAD.name:
      return PAYLOAD[method]();
    default:
      return null;
  }
}

function Protocol(name) {
  return dispatch(name, 'create');
}

function ProtocolUI(name) {
  return dispatch(name, 'createUI');
}

function Packet(name) {
  this.name = name;
  this.bytes = 0;
  this.protocols = [
    ETHERNET.create()
  ];
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
  this.bytes = pkt.bytes;
  this.protocols = _.map(pkt.protocols, function(p) {
    console.log('pkt name:', p.name);
    return new ProtocolUI(p.name);
  });
}

PacketUI.prototype.toBase = function() {
  var result = new Packet(this.name);
  result.bytes = this.bytes;
  result.protocols = _.map(this.protocols, function(pUI) {
    return pUI.toBase();
  });
  return result;
}


function create(name) {
  return new Packet(name);
}

function createUI(pkt) {
  return new PacketUI(pkt);
}

function getPayloads(name) {
  console.log('getpaylodas name:', name);
  if(name in Protocols) {
    return Protocols[name];
  } else {
    return [];
  }
}


return {
  create: create,
  createUI: createUI,
  getPayloads: getPayloads
};

});
