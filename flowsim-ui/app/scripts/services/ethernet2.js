'use strict';

angular.module('flowsimUiApp')
  .factory('Ethernet2', function(UInt) {

var macPattern = /^([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})(-|:)([a-fA-F0-9]{1,2})$/;
   
function isMAC(str) {
  return macPattern.test(str);
}

function consMAC(str) {
  var tmp = input.match(macPattern);
  return _(_.range(6)).map(function(i) {
    return parseInt('0x'+tmp[2*i+1]);
  });
}
                     
function dispMAC(array) {
  return array[0].toString(16) + ':' +
    array[1].toString(16) + ':' +
    array[2].toString(16) + ':' +
    array[3].toString(16) + ':' +
    array[4].toString(16) + ':' +
    array[5].toString(16);
}

var Ethernet = {
  name: 'Ethernet',
  shortName: 'eth',
  bytes: 18,
  fields: [{
    name: 'Src',
    bitwidth: 48,
    matchable: true,
    setable: true,
    testStr: isMAC,
    consStr: consMAC,
    dispStr: dispMAC,
    tip: 'Ethernet Src MAC Address'
  }, {
    name: 'Dst',
    bitwidth: 48,
    matchable: true,
    setable: true,
    testStr: isMAC,
    consStr: consMAC,
    dispStr: dispMAC,
    tip: 'Ethernet Dst MAC Address'
  }, {
    name: 'Type',
    bitwidth: 16,
    matchable: true,
    dispStr: function(val) { 
      return '0x' + UInt.padZeros(val.toString(16), 4);
    },
    tip: 'Ethernet Payload Type/Length'
  }]
};

var Payloads = {
  VLAN: {
    type: 0x8100
  }, 
  MPLS: {
    type: 0x8847
  },
  ARP: {
    type: 0x0806
  },
  IPv4: {
    type: 0x0800
  },
  IPv6: {
    type: 0x86dd
  }
};

return {
  Ethernet: Ethernet,
  Payloads: Payloads
};

});
