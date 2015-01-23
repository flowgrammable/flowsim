'use strict';

angular.module('flowsimUiApp')
  .factory('Internal', function() {

var Internal = {
  name: 'Internal',
  shortName: 'in',
  fields: [{
    name: 'In_Port',
    bitwidth: 32,
    matchable: true,
    tip: 'Logical Port'
  }, {
    name: 'In_Phy_Port',
    bitwidth: 32,
    matchable: true,
    tip: 'Physical Port'
  }, {
    name: 'Tunnel_ID',
    bitwidth: 32,
    matchable: true,
    tip: 'Tunnel ID'
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
  }, {
    name: 'Metadata',
    bitwidth: 64,
    setable: false,
    matchable: true,
    tip: 'Dataplane Metadata'
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


