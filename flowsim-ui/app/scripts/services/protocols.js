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

    var macPattern = /([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}/;

    function validMac(mac) {
      return macPattern.test(mac);
    }

    var Payloads = {
      Ethernet: ['VLAN', 'ARP', 'MPLS', 'IPv4', 'IPv6'],
      VLAN: ['VLAN', 'ARP', 'MPLS', 'IPv4', 'IPv6'],
      ARP: [],
      MPLS: [],
      IPv4: ['ICMPv4', 'TCP', 'UDP', 'SCTP'],
      IPv6: ['ICMPv6', 'TCP', 'UDP', 'SCTP'],
      ICMPv4: [],
      ICMPv6: [],
      TCP: [],
      UDP: [],
      SCTP: []
    };

    this.createPacket = function(name) {
      return new Packet(name, new this.Ethernet());
    };

    this.getOptions = function(name) {
      if(name in Payloads) {
        return Payloads[name];
      } else {
        return [];
      }
    };

    this.createProtocol = function(name) {
      return new this[name];
    }

    this.Ethernet = function() {
      this.name = 'Ethernet';
      this.attrs = [ {
        name: 'Src',
        value: '00:00:00:00:00:00',
        test: validMac,
        tip: 'Ethernet source MAC address'
      }, {
        name: 'Dst',
        value: '00:00:00:00:00:00',
        test: validMac,
        tip: 'Ethernet destination MAC address'
      }, {
        name: 'Typelen',
        value: 0,
        test: function() { return true; },
        tip: 'Ethernet type/length'
      }];
    };
    this.Ethernet.prototype.bytes = function() { return 14; };

    this.ARP = function() {
      this.name = 'ARP';
      this.attrs = [{
        name: 'Opcode',
        value: 0,
        test: function() { return true; },
        tip: 'ARP message type'
      }, {
        name: 'SHA',
        value: '00:00:00:00:00:00',
        test: validMac,
        tip: 'Source hardware address'
      }, {
        name: 'SPA',
        value: '0.0.0.0',
        test: function() { return true; },
        tip: 'Source protocol address'
      }, {
        name: 'THA',
        value: '00:00:00:00:00:00',
        test: validMac,
        tip: 'Target hardware address'
      }, {
        name: 'TPA',
        value: '0.0.0.0',
        test: function() { return true; },
        tip: 'Target protocol address'
      }];
    };
    this.ARP.prototype.bytes = function() {
      return 28;
    };

  });
