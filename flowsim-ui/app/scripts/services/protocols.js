'use strict';

function Packet(name, protocol) {
  if(typeof name === 'string') {
    this.name     = name;
    this.length   = protocol !== undefined ? 1 : 0;
    this._bytes   = protocol !== undefined ? protocol.bytes() : 0;
    this._payload = protocol !== undefined ? [protocol] : [];
  } else {
  }
}

Packet.prototype.push = function(protocol) {
  var top = this.top();
  this.length += 1;
  if(top) {
    top.setPayload(protocol.name);
  }
  this._payload.push(protocol);
  this._bytes += protocol.bytes();
};

Packet.prototype.pop = function() {
  var top = this.top();
  if(top) {
    this.length -= 1;
    this._bytes -= top.bytes();
    this._payload.splice(this._payload.length-1);
  }
  top = this.top();
  if(top) {
    top.clearPayload();
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
      TCP, UDP, SCTP, PAYLOAD) {

    var Payloads = {
      Ethernet: ETHERNET.Payloads,
      VLAN:     VLAN.Payloads,
      ARP:      ARP.Payloads,
      MPLS:     MPLS.Payloads,
      IPv4:     IPV4.Payloads,
      IPv6:     IPV6.Payloads,
      ICMPv4:   ICMPV4.Payloads,
      ICMPv6:   ICMPV6.Payloads,
      TCP:      TCP.Payloads,
      UDP:      UDP.Payloads,
      SCTP:     SCTP.Payloads
    };

    function loadProtocol(payloadAttrs, fields){
      for(var y in payloadAttrs){
        var fieldName = payloadAttrs[y].name.toLowerCase();
        if(fields[fieldName]){
          payloadAttrs[y].value = fields[fieldName];
        }

      }
    }

    this.loadPacket = function(packetBody) {
      var pack = new Packet(packetBody.name);
      console.log('packetBody', packetBody);
      pack._bytes = packetBody.bytes;
      for (var x in packetBody.protocols){
        switch(packetBody.protocols[x].name){
          case 'Ethernet':
            pack.push(new ETHERNET.create());
            loadProtocol(pack._payload[pack.length - 1].attrs,
              packetBody.protocols[x].fields);
            break;
          default:
            break;
        }
      }
      return pack;
    };

  });
