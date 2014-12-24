'use strict';

angular.module('flowsimUiApp')
  .factory('ICMPv6', function() {

var ICMPv6 = {
  name: 'ICMPv6',
  bytes: 8,
  fields:[{
    name: 'Type',
    bitwidth: 8,
    matchable: true,
    setable: true,
    tip: 'Type'
  },{
    name: 'Code',
    bitwidth: 8,
    matchable: true,
    setable: true,
    tip: 'Code'
  }]
};

var Payloads = {

};

return {
  ICMPv6: ICMPv6,
  Payloads: Payloads
};

});
