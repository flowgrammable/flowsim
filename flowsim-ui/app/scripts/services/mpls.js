'use strict';

angular.module('flowsimUiApp')
  .factory('MPLS', function() {

var MPLS = {
  name: 'MPLS',
  bytes: 4,
  pushable: true,
  popable: true,
  fields: [{
    name: 'Label',
    bitwidth: 20,
    matchable: true,
    setable: true,
    tip: 'Label'
  },{
    name: 'TC',
    bitwidth: 3,
    matchable: true,
    setable: true,
    tip: 'Traffic Class'
  },{
    name: 'BOS',
    bitwidth: 1,
    matchable: true,
    setable: true,
    tip: 'Bottom of Stack'
  },{
    name: 'TTL',
    bitwidth: 8,
    matchable: false,
    setable: true,
    decable: true,
    copyIn: true,
    copyOut: true
  }]
};

var Payloads = {
  Type: {
    '0x8847': 'MPLS',
    '0x0800': 'IPv4',
    '0x86dd': 'IPv6'
  }
};

return {
  MPLS: MPLS,
  Payloads: Payloads
};

});
