
var fgPacket = angular.module('fgPacket', ['fgProtocol']);

var isUInt16 = function(i) {
  return typeof i == "number" && isFinite(i) && i%1===0 && i >= 0 i <= 65535;
}

var isMAC = function(m) {
  var macPat = /(([0-9a-fA-F]{2})(-|:)){5}([0-9a-fA-F]{2})/;
  return typeof m === "string" && macPat.test(m);
}

var isIPv4 = function() {
  var ipv4Pat = /([0-9]{1,3}\.){3][0-9]{1,3}/;
  return typeof m === "string" && ipv4Pat.test(m);
}

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
      case 'Ethernet': return new Ethernet(); break;
      case 'ARP': return new ARP(); break;
      case 'MPLS': return new MPLS(); break;
      case 'IPv4': return new IPv4(); break;
      case 'IPv6': return new IPv6(); break;
      case 'ICMPv4': return new ICMPv4(); break;
      case 'ICMPv6': return new ICMPv6(); break;
      case 'TCP': return new TCP(); break;
      case 'UDP': return new UDP(); break;
      case 'SCTP': return new SCTP(); break;
      default: return null;
    }
  }
}

fgPacket.controller('packetCtrl', function($scope, Ethernet) {

  var namePattern = /[a-zA-Z_][a-zA-Z_0-9]*/;

  $scope.packets = {};
  $scope.names = ['one', 'two'];
  $scope.packet = null;

  $scope.getProtocols = function() {
    return {
      Ethernet: ['VLAN', 'ARP', 'MPLS', 'IPv4', 'IPv6'],
      VLAN: ['VLAN', 'ARP', 'MPLS', 'IPv4', 'IPv6'],
      MPLS: ['VLAN', 'ARP', 'MPLS', 'IPv4', 'IPv6'],
      IPv4: ['TCP', 'UDP', 'SCTP', 'ICMPv4', 'ICMPv6'],
      IPv6: ['TCP', 'UDP', 'SCTP', 'ICMPv4', 'ICMPv6']
    };
  };

  $scope.createProtocol = function(protocol) {
    return Packet.createProtocol(protocol);
  }

  $scope.savePacket = function() {
  }

  // This function is called by the UI widet to
  // provide an array of strings of all existing
  // packets
  $scope.listPackets = function(cb) {
    cb($scope.names, null);
  }

  // This function is called by the UI widget to
  // create a new named packet
  $scope.addPacket = function(name) {
    if(!namePattern.test(name)) {
      return 'Bad name';
    } else if(name in $scope.packets) {
      return 'Name exists';
    } else {
      $scope.packets[name] = new Ethernet.Header();
      return 'success';
    }
  }

  // This function is called by the UI widget to
  // delete a named packet
  $scope.delPacket = function(name) {
    if(name in $scope.packets) {
      delete $scope.packets[name];
    }
  }

  var pattern = /(([0-9a-fA-F]{1,2})(-|:)){5}([0-9a-fA-F]{1,2})/;

  // This function is called by the UI widget to
  // change the focus of a named packet
  $scope.setPacket = function(name) {
    if(typeof name === 'string') {
      $scope.packet = $scope.packets[name];
      // Notify any children controllers of the focus change
      $scope.$broadcast('change', {
        list: packet
      });
    } else {
      console.log('all packets have been deleted');
    }
  }

});

