'use strict';

angular.module('flowsimUiApp')
  .factory('SCTP', function() {

var SCTP = {
  name: 'SCTP',
  bytes: 12,
  fields:[{
    name: 'Src',
    bitwidth: 16,
    matchable: true,
    setable: true,
    tip: 'Source Port'
  },{
    name: 'Dst',
    bitwidth: 16,
    matchable: true,
    setable: true,
    tip: 'Destination Port'
  }]
};

var Payloads = {
  Type: {
    'payload':'Payload'
  }
};

return {
  SCTP: SCTP,
  Payloads: Payloads
};

});
