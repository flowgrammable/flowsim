'use strict';

angular.module('flowsimUiApp')
  .service('IPV6', function IPV6(fgConstraints, fgUI){

var NAME = 'IPv6';

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

function _IPv6() {
  this.name = NAME;
  this.bytes = 40;
  this.fields = {
    dscp: 0,
    ecn: 0,
    proto: 0,
    src: '0:0:0:0:0:0:0:0',
    dst: '0:0:0:0:0:0:0:0',
    flabel: '0:0:0:0:0:0:0:0',
    exthdr: '0:0:0:0:0:0:0:0'
  };
}

function _IPV6_UI(ipv6) {
  ipv6 = ipv6 === undefined ? new _IPV6() : ipv6;
  this.name = NAME;
  this.bytes = ipv6.bytes;
  this.attrs = _.map(ipv6.fields, function(value, key) {
    switch(key) {
      case 'dscp':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUInt(0, 0x3f),
          tip: 'Differentiated Services Code Point'
        };
      case 'ecn':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUInt(0, 0x03),
          tip: 'Explicit Congestion Notification'
        };
      case 'proto':
        return {
          name: key,
          value: value,
          test: fgConstraints.isUInt(0, 255),
          tip: 'Protocol'
        };
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
          test: isIPv6,
          tip: 'Flow Label'
        };
      case 'dscp':
        return {
          name: key,
          value: value,
          test: isIPv6,
          tip: 'Extension Header'
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

_IPv6.prototype.setPayload = function(name) {
  this.attrs[2].value = Payloads[name] || 0;
};

_IPv6.prototype.clearPayload = function(name) {
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
