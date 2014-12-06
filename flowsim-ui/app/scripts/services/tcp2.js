'use strict';

angular.module('flowsimUiApp')
  .factory('TCP2', function() {

var TCP = {
  name: 'TCP',
  bytes: 20,
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
  TCP: TCP,
  Payloads: Payloads
};

});
