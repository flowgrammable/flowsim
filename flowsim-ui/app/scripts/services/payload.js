'use strict';

angular.module('flowsimUiApp')
  .factory('Payload', function(){

var Payload = {
  name: 'Payload',
  bytes: 0,
  fields: [{
    name: 'Size',
    bitwidth: 16,
    matchable: false,
    setable: false,
    tip: 'Size of payload'
  }]
};

var Payloads = {
  Type: {
    '':''
  }
};

return {
  Payload: Payload,
  Payloads: Payloads
};

});
