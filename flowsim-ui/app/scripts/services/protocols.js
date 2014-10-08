'use strict';

function Packet(name, protocol) {
  this.name     = name;
  this.length   = protocol !== undefined ? 1 : 0;
  this._bytes   = protocol !== undefined ? protocol.bytes() : 0;
  this._payload = protocol !== undefined ? [protocol] : [];
}

Packet.prototype.push = function(protocol) {
  this.length += 1;
  this._payload.push(protocol);
  this._bytes += protocol.bytes();
};

Packet.prototype.pop = function() {
  if(this._payload.length) {
    this.length -= 1;
    this._bytes -= this._payload[this._payload.length-1].bytes();
    this._payload.splice(this._payload.length-1);
  }
};

Packet.prototype.top = function() {
  if(this._payload.length) {
    return this._payload[this._payload.length-1];
  } else {
    return null;
  }
};

Packet.prototype.bytes = function() {
  return this._bytes;
};

Packet.prototype.size = function() {
  return this._payload.length;
};

Packet.prototype.items = function() {
  return this._payload;
};

/**
 * @ngdoc service
 * @name flowsimUiApp.protocols
 * @description
 * # protocols
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('Protocols', 
    function protocols(ETHERNET, VLAN, ARP, MPLS, IPV4, IPV6, ICMPV4, ICMPV6, 
      TCP, UDP, SCTP) {

    var Payloads = {
      Ethernet: ETHERNET.Payloads,
      VLAN: VLAN.Payloads,
      ARP: ARP.Payloads,
      MPLS: MPLS.Payloads,
      IPv4: IPV4.Payloads,
      IPv6: IPV6.Payloads,
      ICMPv4: ICMPV4.Payloads,
      ICMPv6: ICMPV6.Payloads,
      TCP: TCP.Payloads,
      UDP: UDP.Payloads,
      SCTP: SCTP.Payloads
    };

    this.createPacket = function(name) {
      return new Packet(name, ETHERNET.create());
    };

    this.getOptions = function(name) {
      if(name in Payloads) {
        return Payloads[name];
      } else {
        return [];
      }
    };

    this.createProtocol = function(name) {
      switch(name) {
        case 'Ethernet':
          return Ethernet.create();
          break;
        case 'VLAN':
          return VLAN.create();
          break;
        case 'MPLS':
          return MPLS.create();
          break;
        case 'ARP':
          return ARP.create();
          break;
        case 'IPv4':
          return IPV4.create();
          break;
        case 'IPv6':
          return IPV6.create();
          break;
        case 'ICMPv4':
          return ICMPV4.create();
          break;
        case 'ICMPv6':
          return ICMPV6.create();
          break;
        case 'TCP':
          return TCP.create();
          break;
        case 'UDP':
          return UDP.create();
          break;
        case 'SCTP':
          return SCTP.create();
          break;
        default:
          return null;
          break;
      }
    }

  });

