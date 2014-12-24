'use strict';

angular.module('flowsimUiApp')
  .factory('ARP', function(Ethernet, IPv4) {

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
    testStr: Ethernet.isMAC,
    consStr: Ethernet.consMAC,
    dispStr: Ethernet.dispMAC,
    tip: 'Source Hardware Address'
  },{
    name: 'SPA',
    bitwidth: 32,
    matchable: true,
    setable: true,
    testStr: IPv4.isAddress,
    consStr: IPv4.consAddress,
    dispStr: IPv4.dispAddress,
    tip: 'Source protocol address'
  },{
    name: 'THA',
    bitwidth: 48,
    matchable: true,
    setable: true,
    testStr: Ethernet.isMAC,
    consStr: Ethernet.consMAC,
    dispStr: Ethernet.dispMAC,
    tip: 'Target hardware address'
  },{
    name: 'TPA',
    bitwidth: 32,
    matchable: true,
    setable: true,
    testStr: IPv4.isAddress,
    consStr: IPv4.consAddress,
    dispStr: IPv4.dispAddress,
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
