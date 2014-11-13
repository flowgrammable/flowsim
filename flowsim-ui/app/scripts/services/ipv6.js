'use strict';

angular.module('flowsimUiApp')
  .factory('IPV6', function(fgConstraints, fgUI){

var NAME = 'IPv6';

// Javascript regex patterns that support prefix/infix/postfix :: notation
// prefix/postfix are complete
// infix is not complete, regex have no counting ability, so you must ensure
// that not too many octets are on either side of the :: notation

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

var Payloads = {
  'ICMPv6': 1,
  'TCP'   : 6,
  'UDP'   : 17,
  'SCTP'  : 132,
  'Payload' : 0
};

function IPv6() {
  this.name = NAME;
  this.bytes = 40;
  this.fields = {
    src: '0:0:0:0:0:0:0:0',
    dst: '0:0:0:0:0:0:0:0',
    flabel: '0:0:0:0:0:0:0:0'
  };
}

function IPv6_UI(ipv6) {
  ipv6 = ipv6 === undefined ? new IPv6() : ipv6;
  this.name = NAME;
  this.bytes = ipv6.bytes;
  this.attrs = _.map(ipv6.fields, function(value, key) {
    switch(key) {
      case 'src':
        return {
          name: key,
          value: value,
          test: isIPv6,
          tip: 'Source Address'
        };
      case 'dst':
        return {
          name: key,
          value: value,
          test: isIPv6,
          tip: 'Destination Address'
        };
      case 'flabel':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUInt(0,0xfffff),
          tip: 'Flow Label'
        };
      default:
        return {
          name: key,
          value: value,
          test: function() { return true; },
          tip: 'Unknown'
        };
    }
  });
}

IPv6_UI.prototype.toBase = function() {
  var result = new IPv6();
  result.name = this.name;
  result.bytes = this.bytes;
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

IPv6_UI.prototype.setPayload = function(name) {
  this.attrs[2].value = Payloads[name] || 0;
};

IPv6_UI.prototype.clearPayload = function() {
  this.attrs[2].value = 0;
};

return {
  name: NAME,
  IPv6: IPv6,
  create: function() { return new IPv6(); },
  createUI: function(v6) { return new IPv6_UI(v6); },
  Payloads: _(Payloads).keys()
};

});
