
var fgPacket = angular.module('fgPacket', ['fgProtocol']);

var isUInt16 = function(i) {
  return (typeof i == "number") && isFinite(i) && (i%1===0) && i >= 0 && i <= 65535;
};

var isMAC = function(m) {
  var macPat = /(([0-9a-fA-F]{2})(-|:)){5}([0-9a-fA-F]{2})/;
  return typeof m === "string" && macPat.test(m);
};

var isIPv4 = function() {
  var ipv4Pat = /([0-9]{1,3}\.){3][0-9]{1,3}/;
  return typeof m === "string" && ipv4Pat.test(m);
};

function Ethernet() {
  this.name = 'Ethernet';
  this.attrs = [
    { name: 'Src', value: '00:00:00:00:00:00', test: isMAC, tip: ''},
    { name: 'Dst', value: '00:00:00:00:00:00', test: isMAC, tip: ''},
  ];
}

function ARP() {
  this.name = 'ARP';
  this.attrs = [
    { name: 'Opcode', value: 0, test: isARPOpcode, tip: ''},
    { name: 'SHA', value: '00:00:00:00:00:00', test: isMAC, tip: ''},
    { name: 'SPA', value: '0.0.0.0', test: isIPv4, tip: ''},
    { name: 'THA', value: '00:00:00:00:00:00', test: isMAC, tip: ''},
    { name: 'TPA', value: '0.0.0.0', test: isIPv4, tip: ''},
  ];
}

function MPLS() {
  this.name = 'MPLS';
  this.attrs = [
  ];
}

function IPv4() {
  this.name = 'IPv4';
  this.attrs = [
  { name: 'Src', value: '0.0.0.0', test: isIPv4, tip: ''},
  { name: 'Dst', value: '0.0.0.0', test: isIPv4, tip: ''}
  ];
}

function IPv6() {
  this.name = 'IPv6';
  this.attrs = [
  ];
}

function ICMPv4() {
  this.name = 'ICMPv4';
  this.attrs = [
  ];
}

function ICMPv6() {
  this.name = 'ICMPv6';
  this.attrs = [
  ];
}

function TCP() {
  this.name = 'TCP';
  this.attrs = [
    { name: 'Src', value: 0, test: isUInt16, tip: 'TCP source port' },
    { name: 'Dst', value: 0, test: isUInt16, tip: 'TCP destination port' }
  ];
}

function UDP() {
  this.name = 'UDP';
  this.attrs = [
    { name: 'Src', value: 0, test: isUInt16, tip: 'UDP source port' },
    { name: 'Dst', value: 0, test: isUInt16, tip: 'UDP destination port' }
  ];
}

function SCTP() {
  this.name = 'SCTP';
  this.attrs = [
    { name: 'Src', value: 0, test: isUInt16, tip: 'SCTP source port' },
    { name: 'Dst', value: 0, test: isUInt16, tip: 'SCTP destination port' }
  ];
}

var Packet = {
  createProtocol: function(name) {
    switch(name) {
      case 'Ethernet': return new Ethernet();
      case 'ARP': return new ARP();
      case 'MPLS': return new MPLS();
      case 'IPv4': return new IPv4();
      case 'IPv6': return new IPv6();
      case 'ICMPv4': return new ICMPv4();
      case 'ICMPv6': return new ICMPv6();
      case 'TCP': return new TCP();
      case 'UDP': return new UDP(); 
      case 'SCTP': return new SCTP();
      default: return null;
    }
  }
};

