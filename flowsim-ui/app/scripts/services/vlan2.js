'use strict';

angular.module('flowsimUiApp')
  .factory('VLAN2', function(UInt) {

var VLAN = {
  name: 'VLAN',
  shortName: 'vlan',
  bytes: 4,
  pushable: true,
  popable: true,
  fields: [{
    name: 'PCP',
    bidwidth: 3,
    matchable: true,
    setable: true,
    testStr: UInt.is(3),
    consStr: UInt.consStr(3),
    dispStr: UInt.toString(3),
    tip: 'Priority Code Point'
  }, {
    name: 'DEI',
    bidwidth: 1,
    matchable: false,
    setable: false,
    testStr: UInt.is(1),
    consStr: UInt.consStr(1),
    dispStr: UInt.toString(3),
    tip: 'Drop eligible indicator'
  }, {
    name: 'VID',
    bidwidth: 12,
    matchable: true,
    setable: true,
    testStr: UInt.is(12),
    consStr: UInt.consStr(12),
    dispStr: UInt.toString(12),
    tip: 'VLAN identifier'
  }, {
    name: 'Type',
    bitwidth: 16,
    matchable: false,
    setable: false,
    testStr: UInt.is(16),
    consStr: UInt.consStr(16),
    dispStr: UInt.toString(16)
  }]
};

var Payloads = {
  Type: {
    '0x8100': 'VLAN',
    '0x8847': 'MPLS',
    '0x0806': 'ARP',
    '0x0800': 'IPv4',
    '0x86dd': 'IPv6',
    'Payload': 0
  }
};

return {
  VLAN: VLAN,
  Payloads: Payloads
};

});
