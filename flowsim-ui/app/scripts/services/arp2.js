'use strict';

angular.module('flowsimUiApp')
  .factory('ARP2', function(Ethernet2, IPv42) {

var ARP = {
  name: 'ARP',
  bytes: 28,
  fields: [{
    name: 'Opcode',
    bitwidth: 16,
    matchable: true,
    setable: true,
    tip: 'Opcode'
  },{
    name: 'SHA',
    bitwidth: 48,
    matchable: true,
    setable: true,
    testStr: Ethernet2.isMAC,
    consStr: Ethernet2.consMAC,
    dispStr: Ethernet2.dispMAC,
    tip: 'Source Hardware Address'
  },{
    name: 'SPA',
    bitwidth: 32,
    matchable: true,
    setable: true,
    testStr: IPv42.isAddress,
    consStr: IPv42.consAddress,
    dispStr: IPv42.dispAddress,
    tip: 'Source protocol address'
  },{
    name: 'THA',
    bitwidth: 48,
    matchable: true,
    setable: true,
    testStr: Ethernet2.isMAC,
    consStr: Ethernet2.consMAC,
    dispStr: Ethernet2.dispMAC,
    tip: 'Target hardware address'
  },{
    name: 'TPA',
    bitwidth: 32,
    matchable: true,
    setable: true,
    testStr: IPv42.isAddress,
    consStr: IPv42.consAddress,
    dispStr: IPv42.dispAddress,
    tip: 'Target protocol address'
  }]
};

var Payloads = {

};

return {
  ARP: ARP,
  Payloads: Payloads
};

});
