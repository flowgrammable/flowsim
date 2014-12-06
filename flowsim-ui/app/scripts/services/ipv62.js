'use strict';

angular.module('flowsimUiApp')
  .factory('IPv62', function(UInt) {

var qualifiedPattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
var prefixPattern = /^::[0-9a-fA-F](:[0-9a-fA-F]{1,4}){0,6}$/;
var infixPattern = /^(([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4}){0,6})?$/;
var postfixPattern = /^([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}::$/;

function isIPv6(addr) {
  var fixes, prefix, postfix;
  if(qualifiedPattern.test(addr) || prefixPattern.test(addr) ||
     postfixPattern.test(addr)) {
    return true;
  } else if(infixPattern.test(addr)) {
    fixes = addr.split('::');
    prefix = _(fixes[0].split(':')).filter(function(s) {
      return s.length > 0;
    });
    postfix = _(fixes[1].split(':')).filter(function(s) {
      return s.length > 0;
    });
    return prefix.length + postfix.length < 8;
  } else {
    return false;
  }
}

function consIPv6Address(string){
  var parts = 8;
  var colonCount, lastColon, part, replacement, replacementCount;
  if (string.indexOf('::') !== string.lastIndexOf('::')) {
    return null;
  }
  colonCount = 0;
  lastColon = -1;
  while ((lastColon = string.indexOf(':', lastColon + 1)) >= 0) {
    colonCount++;
  }
  if (string[0] === ':') {
    colonCount--;
  }
  if (string[string.length - 1] === ':') {
    colonCount--;
  }
  replacementCount = parts - colonCount;
  replacement = ':';
  while (replacementCount--) {
    replacement += '0:';
  }
  string = string.replace('::', replacement);
  if (string[0] === ':') {
    string = string.slice(1);
  }
  if (string[string.length - 1] === ':') {
    string = string.slice(0, -1);
  }
  return (function() {
    var _i, _len, _ref, _results;
    _ref = string.split(':');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      _results.push(parseInt(part, 16));
    }
    return _results;
  })();
}

function dispIPv6Address(val){
  return _(val).map(function(oct2){
    return UInt.padZeros(oct2.toString(16), 0);
  }).join(':');
}

var IPv6 = {
  name: 'IPv6',
  bytes: 40,
  fields: [{
    name: 'Flabel',
    bitwidth: 20,
    setable: true,
    matchable: true,
    tip: 'Flow label'
  },{
    name: 'Src',
    bitwidth: 128,
    setable: true,
    matchable: true,
    testStr: isIPv6,
    consStr: consIPv6Address,
    dispStr: dispIPv6Address,
    tip: 'Source address'
  },{
    name: 'Dst',
    bitwidth: 128,
    setable: true,
    matchable: true,
    test: isIPv6,
    consStr: consIPv6Address,
    dispStr: dispIPv6Address,
    tip: 'Destination address'
  },{
    name: 'TTL',
    bitwidth: 8,
    setable: true,
    decable: true,
    copyIn: true,
    copyOut: true,
    tip: 'Time To Live'
  }]
};

var Payloads = {
  Proto: {
    '0x01': 'ICMPv6',
    '0x06': 'TCP',
    '0x11': 'UDP',
    '0x81': 'SCTP'
  }
};

return {
  consIPv6Address: consIPv6Address,
  dispIPv6Address: dispIPv6Address,
  isIPv6: isIPv6,
  IPv6: IPv6,
  Payloads: Payloads
};

});
