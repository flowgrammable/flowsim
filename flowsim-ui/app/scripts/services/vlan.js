'use strict';

function validateUInt(lb, ub) {
  var pat = /^[0-9]+$/;
  return function(val) {
    if(!pat.test(val)) {
      return false;
    }
    var _val = parseInt(val);
    if(typeof _val !== 'number' || !isFinite(_val) || _val%1 !== 0 || _val < lb || 
              _val > ub) {
      return false;
    }
    return true;
  };
}

function _VLAN() {
  this.name = 'VLAN';
  this.attrs = [{
    name: 'PCP',
    value: 0,
    test: validateUInt(0, 7),
    tip: 'VLAN Priority Code Point'
  }, {
    name: 'DEI',
    value: 0,
    test: validateUInt(0,1),
    tip: 'VLAN Drop Eligibility Indicator'
  }, {
    name: 'VLAN ID',
    value: 0,
    test: validateUInt(0, 4095),
    tip: 'VLAN Tag Identifier'
  }, {
    name: 'TypeLen',
    value: 0,
    test: validateUInt(0, 65536),
    tip: 'Ethernet type or length of payload'
  }];
}

_VLAN.prototype.bytes = function() {
  return 4;
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
    this.Payloads = [
      'VLAN',
      'MPLS',
      'ARP',
      'IPv4',
      'IPv6'
    ];
    this.create = function() {
      return new _VLAN();
    };
  });
