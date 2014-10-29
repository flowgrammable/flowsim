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

function Protocol(name) {
  switch(name) {
    case ETHERNET.name:
      return ETHERNET.create();
    case VLAN.name:
      return VLAN.create();
    case MPLS.name:
      return MPLS.create();
    case ARP.name:
      return ARP.create();
    case IPV4.name:
      return IPV4.create();
    case IPV6.name:
      return IPV6.create();
    case ICMPV4.name:
      return ICMPV4.create();
    case ICMPV6.name:
      return ICMPV6.create();
    case TCP.name:
      return TCP.create();
    case UDP.name:
      return UDP.create();
    case SCTP.name:
      return SCTP.create();
    case PAYLOAD.name:
      return PAYLOAD.create();
    default:
      return null;
  }
}

function ProtocolUI(protocol) {
  switch(name) {
    case ETHERNET.name:
      return ETHERNET.createUI(protocol);
    case VLAN.name:
      return VLAN.createUI(protocol);
    case MPLS.name:
      return MPLS.createUI(protocol);
    case ARP.name:
      return ARP.createUI(protocol);
    case IPV4.name:
      return IPV4.createUI(protocol);
    case IPV6.name:
      return IPV6.createUI(protocol);
    case ICMPV4.name:
      return ICMPV4.createUI(protocol);
    case ICMPV6.name:
      return ICMPV6.createUI(protocol);
    case TCP.name:
      return TCP.createUI(protocol);
    case UDP.name:
      return UDP.createUI(protocol);
    case SCTP.name:
      return SCTP.createUI(protocol);
    case PAYLOAD.name:
      return PAYLOAD.createUI(protocol);
    default:
      return null;
}

function Packet(name) {
  this.name = name;
  this.bytes = 0;
  this.protocols = [
    ETHERNET.create();
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
    return new ProtocolUI(p);
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

function getPayloads(protocol) {
  if(protocol in Protocols) {
    return Protocols[protocol].Payloads;
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
