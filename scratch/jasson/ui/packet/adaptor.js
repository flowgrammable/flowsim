
(function(){

var EthernetAdaptor = function(eth) {
  this.actual = eth;
  this.name = 'Ethernet';
  this.attrs = [
    { 
      name: 'Src',
      tip: 'Ethernet source MAC address',
      test: fgEthernet.isMAC,
      value: eth.src
    }, {
      name: 'Dst',
      tip: 'Ethernet destination MAC address',
      test: fgEthernet.isMAC,
      value: eth.dst
    }, {
      name: 'type',
      tip: 'Type or size of the payload',
      test: fgUtils.isUInt16,
      value: eth.type
    }
  ];
};

EthernetAdaptor.prototype.save = function() {
  this.eth.setSrc(this.fields[0].value);
  this.eth.setDst(this.fields[1].value);
  this.eth.setEtherType(this.fields[2].value);
};

var VLANAdaptor = function() {
  throw 'VLANAdaptor not implemented';
};

var ARPAdaptor = function() {
  throw 'ARPAdaptor not implemented';
};

var MPLSAdaptor = function() {
  throw 'MPLSAdaptor not implemented';
};

var IPv4Adaptor = function() {
  throw 'IPv4Adaptor not implemented';
};

var IPv6Adaptor = function() {
  throw 'IPv6Adaptor not implemented';
};

var ICMPv4Adaptor = function() {
  throw 'ICMPv4Adaptor not implemented';
};

var ICMPv6Adaptor = function() {
  throw 'ICMPv6Adaptor not implemented';
};

var TCPAdaptor = function() {
  throw 'TCPAdaptor not implemented';
};

var UDPAdaptor = function() {
  throw 'UDPAdaptor not implemented';
};

var SCTPAdaptor = function() {
  throw 'SCTPAdaptor not implemented';
};
  
var _createProtocol = function(name, payload) {
  switch(name) {
    case 'Ethernet': return new EthernetAdaptor(payload);
    case 'VLAN': return new VLANAdaptor(payload);
    case 'ARP': return new ARPAdaptor(payload);
    case 'MPLS': return new MPLSAdaptor(payload);
    case 'IPv4': return new IPv4Adaptor(payload);
    case 'IPv6': return new IPv6Adaptor(payload);
    case 'ICMPv4': return new ICMPv4Adaptor(payload);
    case 'ICMPv6': return new ICMPv6Adaptor(payload);
    case 'TCP': return new TCPAdaptor(payload);
    case 'UDP': return new UDPAdaptor(payload);
    case 'SCTP': return new SCTPAdaptor(payload);
    default: throw ('createAdaptor - Unknown protocol: ' + name);
  }
};

var _getProtocols = function() {
  return {
    Ethernet: ['VLAN', 'ARP', 'MPLS', 'IPv4', 'IPv6'],
    VLAN: ['VLAN', 'ARP', 'MPLS', 'IPv4', 'IPv6'],
    ARP: [],
    MPLS: ['IPv4', 'IPv6'],
    IPv4: ['TCP', 'UDP', 'SCTP', 'ICMPv4'],
    IPv6: ['TCP', 'UDP', 'SCTP', 'ICMPv6'],
    TCP: [],
    UDP: [],
    SCTP: [],
    ICMPv4: [],
    ICMPv6: []
  };
};

var _wrapProtocol = function(p) {
  return _createProtocol(p.protocol, p.data);
}

var _Packet = function(pkt) {
  this.actual = pkt;
  this.stack = [];
  for(var i=0; i<pkt.data.length; ++i) {
    this.stack.push(_createProtocol(pkt.data[i].protocol, pkt.data[i].data));
  }
};

var _wrapPacket = function(p) {
  return new _Packet(p);
};

var Adaptor = {
  wrapPacket: _wrapPacket,
  wrapProtocol: _wrapProtocol,
  getProtocols: _getProtocols
};

angular.module('fgPktMgr')
  .value('pktAdaptor', Adaptor);

})();

