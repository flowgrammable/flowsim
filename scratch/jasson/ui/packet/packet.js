
var fgPacket = angular.module('fgPacket', ['fgProtocol']);

fgPacket.controller('packetCtrl', function($scope, Ethernet) {

  var namePattern = /[a-zA-Z_][a-zA-Z_0-9]*/;
  $scope.packets = {};
  $scope.names = ['one', 'two'];
  $scope.packet = null;

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
  var packet = [
    {name: 'Ethernet', fields: [
      { 
        name: 'Src',
        value: '00:00:00:00:00:00',
        tip: 'Ethernet source address, a six byte hexadecimal value',
        test: function(v) { 
          return pattern.test(v);
        }
      }, {
        name: 'Dst',
        value: '00:00:00:00:00:00',
        tip: 'Ethernet destination address, a six byte hexadecimal value',
        test: function(v) { 
          return pattern.test(v);
        }
      }, {
        name: 'Type',
        value: '0',
        tip: 'A two byte hexidecimal value indcating the type of the payload',
        test: function(v) { return 'success';
          return true;
        }
      }
    ]}
  ];

  $scope.options = {
    Ethernet: ['VLAN', 'ARP', 'MPLS', 'IPv4', 'IPv6'],
    VLAN: ['VLAN', 'ARP', 'MPLS', 'IPv4', 'IPv6'],
    MPLS: ['VLAN', 'ARP', 'MPLS', 'IPv4', 'IPv6'],
    IPv4: ['TCP', 'UDP', 'SCTP', 'ICMPv4', 'ICMPv6'],
    IPv6: ['TCP', 'UDP', 'SCTP', 'ICMPv4', 'ICMPv6']
  };

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

