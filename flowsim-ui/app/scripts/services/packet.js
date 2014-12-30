'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.Packet
 * @description
 * # Packet
 * Service in the flowsimUiApp.
 */

angular.module('flowsimUiApp')
  .factory('Packet', function(Ethernet, VLAN, ARP, MPLS, IPv4, IPv6, ICMPv4,
                            ICMPv6, TCP, UDP, SCTP, PAYLOAD, Protocols) {

/*var Protocols = {
  Ethernet: Ethernet,
  VLAN: VLAN,
  ARP: ARP,
  MPLS: MPLS,
  IPv4: IPv4,
  IPv6: IPv6,
  ICMPv4: ICMPv4,
  ICMPv6: ICMPv6,
  TCP: TCP,
  UDP: UDP,
  SCTP: SCTP,
  Payload: PAYLOAD
}; */

function dispatch(name, method, p) {
  switch(name) {
    case ETHERNET.name:
      return ETHERNET[method](p);
    case VLAN.name:
      return VLAN[method](p);
    case MPLS.name:
     return MPLS[method](p);
    case ARP.name:
      return ARP[method](p);
    case IPV4.name:
      return IPV4[method](p);
    case IPV6.name:
      return IPV6[method](p);
    case ICMPV4.name:
      return ICMPV4[method](p);
    case ICMPV6.name:
      return ICMPV6[method](p);
    case TCP.name:
      return TCP[method](p);
    case UDP.name:
      return UDP[method](p);
    case SCTP.name:
      return SCTP[method](p);
    case ND.name:
      return ND[method](p);
    case PAYLOAD.name:
      return PAYLOAD[method](p);
    default:
      return null;
  }
}

function createProtocol(name) {
  return dispatch(name, 'create');
}

function createProtocolUI(p) {
  if(typeof p === 'string') {
    return dispatch(p, 'createUI');
  } else {
    return dispatch(p.name, 'createUI', p);
  }
}

function createProtocol2(name){
  var tmp = _(Protocols.Protocols).find(function(protocol){
    return protocol.name === name;
  });
  _(tmp.fields).each(function(field){
    //field.value = '';
  }, this);
  return tmp;
}

function Packet2(name) {
  this.name = name;
  this.protocols = [
    createProtocol2(Ethernet.Ethernet.name)
  ];
  this.bytes = Ethernet.bytes;
}

Packet2.prototype.push = function(protocol) {
  this.protocols.push(protocol);
  this.bytes += protocol.bytes;
};

Packet2.prototype.pop = function() {
  if(this.protocols.length === 0) {
    return;
  }

  this.bytes -= this.protocols[this.protocols.length-1].bytes;
  this.protocols.splice(this.protocols.length-1);
};

Packet2.prototype.toBase = function() {
  var tmp = {};
  tmp.bytes = this.bytes;
  tmp.name = this.name;
  tmp.protocols = [];
  _(this.protocols).each(function(proto){
    tmp.protocols.push({name: proto.name, bytes: proto.bytes, fields: proto.fields});
  }, this);
  return tmp;
}

function Packet(name) {
  this.name = name;
  this.protocols = [
    createProtocol(ETHERNET.name)
  ];
  this.bytes = this.protocols[0].bytes;
}

Packet.prototype.clone = function() {
  var tmp = new Packet(this.name);
  tmp.bytes = this.bytes;
  tmp.protocols = _(this.protocols).map(function(protocol) {
    return protocol.clone();
  });
  return tmp;
};

Packet.prototype.push = function(protocol) {
  this.protocols.push(protocol);
  this.bytes += protocol.bytes;
};

Packet.prototype.pop = function() {
  if(this.protocols.length === 0) {
    return;
  }

  this.bytes -= this.protocols[this.protocols.length-1].bytes;
  this.prototocols.splice(this.protocols.length-1);
};

function PacketUI(pkt) {
  if(typeof pkt === 'string') {
    this.name = pkt;
    this.protocols = [createProtocolUI(Ethernet.Ethernet.name)];
    this.bytes = this.protocols[0].bytes;
  } else {
    this.name = pkt.name;
    this.bytes = pkt.bytes;
    this.protocols = _.map(pkt.protocols, function(p) {
      return createProtocolUI(p);
    });
  }
}

PacketUI.prototype.toBase = function() {
  var result = new Packet(this.name);
  result.bytes = this.bytes;
  result.protocols = _.map(this.protocols, function(pUI) {
    return pUI.toBase();
  });
  return result;
};

PacketUI.prototype.top = function() {
  return this.protocols.length ? this.protocols[this.protocols.length-1] : null;
};

function create(name) {
  return new Packet(name);
}

/*function createUI(pkt) {
  return new PacketUI(pkt);
}*/

function createUI(pkt){
  return new Packet2(pkt);
}


function getPayloads(name) {
  if(name in Protocols) {
    return Protocols[name].Payloads;
  } else {
    return [];
  }
}


return {
  create: create,
  createUI: createUI,
  createProtocol: createProtocol,
  createProtocolUI: createProtocolUI,
  getPayloads: getPayloads,
  Packet: Packet,
  PacketUI: PacketUI
};

});
