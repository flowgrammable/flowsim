'use strict';
    
var macPattern = /([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}/;

function validMac(mac) {
  return macPattern.test(mac);
}

function Ethernet() {
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
    test: function() { return true; }
  }];
}

Ethernet.prototype.bytes = function() { 
  return 14; 
};

/**
 * @ngdoc service
 * @name flowsimUiApp.ETHERNET
 * @description
 * # ETHERNET
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('ETHERNET', function ETHERNET() {

    this.create = function() {
      return new Ethernet();
    };

    this.Payloads = [
      'VLAN',
      'MPLS',
      'ARP',
      'IPv4',
      'IPv6'
    ];

  });
