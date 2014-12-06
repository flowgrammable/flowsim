'use strict';

angular.module('flowsimUiApp')
  .factory('SCTP2', function() {

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

};

return {
  SCTP: SCTP,
  Payloads: Payloads
};

});
