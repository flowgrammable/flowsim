'use strict';

(function() {

var macPattern = /^([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}$/;

var Payloads = {
  'VLAN': 0x8100,
  'MPLS': 0x8847,
  'ARP':  0x0806,
  'IPv4': 0x0800,
  'IPv6': 0x86dd,
  'Payload' : 0x0000
};

function isMAC(addr) {
  return macPattern.test(addr);
}

function _Ethernet(fields) {
  this.name = 'Ethernet';
  this.attrs = [ {
    name: 'Src',
    value: fields ? fields.src : '00:00:00:00:00:00',
    test: isMAC,
    tip: 'Ethernet source MAC address'
  }, {
    name: 'Dst',
    value: fields ? fields.dst : '00:00:00:00:00:00',
    test: isMAC,
    tip: 'Ethernet destination MAC address'
  }, {
    name: 'Typelen',
    value: fields ? fields.typelen : '0x0000',
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

    this.name = 'Ethernet';

    this.create = function() {
      return new _Ethernet();
    };

    this.createUI = function(fields) {
      console.log('createUI called');
      return new _Ethernet(fields);
    };

    this.Payloads = Object.keys(Payloads);

  });

})();
