'use strict';

angular.module('flowsimUiApp')
  .service('IPV6', function IPV6(fgConstraints, fgUI){

var NAME = 'IPv6';

var Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
[0-9a-fA-F]{1,4}

// Javascript regex patterns that support prefix/infix/postfix :: notation
// prefix/postfix are complete
// infix is not complete, regex have no counting ability, so you must ensure
// that not too many octets are on either side of the :: notation
var prefixPattern = /^::[0-9a-fA-F](:[0-9a-fA-F]{1,4}){0,6}$/;
var infixPattern = /^(([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4}){0,6})?$/;
var postfixPattern = /([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}::$/;

var ipv6Pattern = /^[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}$/;

function isIPv6(addr) {
  return ipv6Pattern.test(addr);
}

var Payloads = {
  'ICMPv6': 1,
  'TCP'   : 6,
  'UDP'   : 17,
  'SCTP'  : 132,
  'Payload' : 0
};

function _IPV6() {
  this.name = NAME;
  this.bytes = 40;
  this.fields = {
    src: '0:0:0:0:0:0:0:0',
    dst: '0:0:0:0:0:0:0:0',
    flabel: '0:0:0:0:0:0:0:0'
  };
}

function _IPV6_UI(ipv6) {
  ipv6 = ipv6 === undefined ? new _IPV6() : ipv6;
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

_IPV6_UI.prototype.toBase = function() {
  var result = new _IPV6();
  result.name = this.name;
  result.bytes = this.bytes
  result.fields = fgUI.stripLabelInputs(this.attrs);
  return result;
};

_IPV6_UI.prototype.setPayload = function(name) {
  this.attrs[2].value = Payloads[name] || 0;
};

_IPV6_UI.prototype.clearPayload = function(name) {
  this.attrs[2].value = 0;
};

this.name = NAME;
this.create = function() {
  return new _IPV6();
};

this.createUI = function(ipv6) {
  return new _IPV6_UI(ipv6);
};

this.Payloads = Object.keys(Payloads);

});
