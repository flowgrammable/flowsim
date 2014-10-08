'use strict';

(function(){

var Payloads = {
 'VLAN': 0x8100,
 'MPLS': 0x8847,
 'ARP':  0x0806,
 'IPv4': 0x0800,
 'IPv6': 0x86dd
};

function _VLAN() {
  this.name = 'VLAN';
  this.attrs = [{
    name: 'PCP',
    value: '0',
    test: fgConstraints.isUInt(0, 7),
    tip: 'VLAN Priority Code Point'
  }, {
    name: 'DEI',
    value: '0',
    test: fgConstraints.isUInt(0,1),
    tip: 'VLAN Drop Eligibility Indicator'
  }, {
    name: 'VLAN ID',
    value: '0',
    test: fgConstraints.isUInt(0, 0x0fff),
    tip: 'VLAN Tag Identifier'
  }, {
    name: 'TypeLen',
    value: '0x0000',
    test: fgConstraints.isUInt(0, 0xffff),
    tip: 'Ethernet type or length of payload'
  }];
}

_VLAN.prototype.bytes = function() {
  return 4;
};

_VLAN.prototype.setPayload = function(name) {
  this.attrs[3].value = '0x' + (Payloads[name] || 0).toString(16);
};

_VLAN.prototype.clearPayload = function() {
  this.attrs[3].value = '0x0000';
};

/**
 * @ngdoc service
 * @name flowsimUiApp.VLAN
 * @description
 * # VLAN
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('VLAN', function VLAN() {
    this.Payloads = Object.keys(Payloads);
    this.create = function() {
      return new _VLAN();
    };
  });

})();

