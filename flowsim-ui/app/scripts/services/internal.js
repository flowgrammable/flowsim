'use strict';

angular.module('flowsimUiApp')
  .factory('Internal', function() {

var Internal = {
  name: 'Intenral',
  fields: [{
    name: 'In_Port',
    bitwidth: 32,
    matchable: true,
    tip: 'Ingress Logical Port'
  }, {
    name: 'In_Phy_Port',
    bitwidth: 32,
    matchable: true,
    tip: 'Ingress Physical Port'
  }, {
    name: 'Tunnel_ID',
    bitwidth: 32,
    matchable: true,
    tip: 'Ingress Tunnel ID'
  }, {
    name: 'Output',
    bitwidth: 32,
    setable: true,
    tip: 'Output Port ID'
  }, {
    name: 'Group',
    bitwidth: 32,
    setable: true,
    tip: 'Group Processing ID'
  }, {
    name: 'Queue',
    bitwidth: 32,
    setable: true,
    tip: 'Egress Queue ID'
  }]
};

var Payloads = {
  Ethernet: {}
};

return {
  Internal: Internal,
  Payloads: Payloads
};

});


