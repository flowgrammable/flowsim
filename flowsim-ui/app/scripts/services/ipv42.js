
'use strict';

angular.module('flowsimUiApp')
  .factory('IPv42', function() {

var addressPattern = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;

function isAddress(str) {
  return addressPattern.test(str);
}

function consAddress(str) {
  var tmp = str.split('.');
  return ((((((+tmp[0])*256)+(+tmp[1]))*256)+(+tmp[2]))*256)+(+tmp[3]);
}

function dispAddress(val) {
  var part1 = val & 255;
  var part2 = ((val >> 8) & 255);
  var part3 = ((val >> 16) & 255);
  var part4 = ((val >> 24) & 255);
  return part4 + '.' + part3 + '.' + part2 + '.' + part1;
}

var IPv4 = {
  name: 'IPv4',
  bytes: 20,
  fields: [{
    name: 'DSCP',
    bitwidth: 6,
    matchable: true,
    setable: true,
    tip: 'Differentiated Services Code Point'
  },{
    name: 'ECN',
    bitwidth: 2,
    matchable: true,
    setable: true,
    tip: 'Explicit Congestion Notification'
  },{
    name: 'TTL',
    bitwidth: 8,
    setable: true,
    decable: true,
    copyIn: true,
    copyOut: true,
    tip: 'Time To Live'
  },{
    name: 'Proto',
    bitwidth: 8,
    matchable: true,
    setable: false,
    tip: 'Protocol'
  },{
    name: 'Src',
    bitwidth: 32,
    matchable: true,
    setable: true,
    testStr: isAddress,
    consStr: consAddress,
    dispStr: dispAddress
  },{
    name: 'Dst',
    bitwidth: 32,
    matchable: true,
    setable: true,
    testStr: isAddress,
    consStr: consAddress,
    dispStr: dispAddress
  }]
};

var Payloads = {
  Proto: {
    '0x01': 'ICMPv4',
    '0x06': 'TCP',
    '0x11': 'UDP',
    '0x84': 'SCTP'
  }
};

return {
  isAddress: isAddress,
  consAddress: consAddress,
  dispAddress: dispAddress,
  IPv4: IPv4,
  Payloads: Payloads
};

});
