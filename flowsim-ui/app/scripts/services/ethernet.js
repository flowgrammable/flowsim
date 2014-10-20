'use strict';

(function() {

var macPattern = /^([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}$/;

var Payloads = {
  'VLAN': 0x8100,
  'MPLS': 0x8847,
  'ARP':  0x0806,
  'IPv4': 0x0800,
  'IPv6': 0x86dd
};

function isMAC(addr) {
  return macPattern.test(addr);
}

function _Ethernet() {
  this.name = 'Ethernet';
  this.attrs = [ {
    name: 'Src',
    value: '00:00:00:00:00:00',
    test: isMAC,
    tip: 'Ethernet source MAC address'
  }, {
    name: 'Dst',
    value: '00:00:00:00:00:00',
    test: isMAC,
    tip: 'Ethernet destination MAC address'
  }, {
    name: 'Typelen',
    value: '0x0000',
    test: fgConstraints.isUInt(0, 0xffff),
    tip: 'Ethernet type/length of payload'
  }];
}

_Ethernet.prototype.bytes = function() {
  return 14;
};

_Ethernet.prototype.setPayload = function(name) {
  this.attrs[2].value = '0x' + (Payloads[name] || 0).toString(16);
};

_Ethernet.prototype.clearPayload = function() {
  this.attrs[2].value = '0x0000';
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

    this.create = function(fields) {
      return new _Ethernet(fields);
    };

    this.Payloads = Object.keys(Payloads);

  });

})();
