'use strict';

angular.module('flowsimUiApp')
  .factory('ICMPv4', function() {

var ICMPv4 = {
  name: 'ICMPv4',
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
  ICMPv4: ICMPv4,
  Payloads: Payloads
};

});
