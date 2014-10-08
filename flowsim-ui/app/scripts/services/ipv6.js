'use strict';

var ipv6Pattern = /^[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}$/;

function isIPv6(addr) {
  return ipv6Pattern.test(addr);
}

var Payloads = {
  'ICMPv6': 1,
  'TCP'   : 6,
  'UDP'   : 17,
  'SCTP'  : 132
};

function _IPv6() {
  this.name = 'IPv6';
  this.attrs = [{
    name: 'DSCP',
    value: 0,
    test: fgConstraints.isUInt(0, 0x3f),
    tip: 'Differentiated Services Code Point'
  }, {
    name: 'ECN',
    value: 0,
    test: fgConstraints.isUInt(0, 0x03),
    tip: 'Explicit Congestion Notification'
  }, {
    name: 'Proto',
    value: 0,
    test: fgConstraints.isUInt(0, 255),
    tip: 'Protocol'
  }, {
    name: 'Src',
    value: '0.0.0.0',
    test: isIPv6,
    tip: 'Source Address'
  }, {
    name: 'Dst',
    value: '0.0.0.0',
    test: isIPv6,
    tip: 'Destination Address'
  }, {
    name: 'FLabel',
    value: '0.0.0.0',
    test: isIPv6,
    tip: 'Flow Label'
  }, {
    name: 'Ext Hdr',
    value: '0.0.0.0',
    test: isIPv6,
    tip: 'Extension Header'
  }];
}

_IPv6.prototype.bytes = function() {
  return 40;
};

_IPv6.prototype.setPayload = function(name) {
  this.attrs[2].value = Payloads[name] || 0;
};

_IPv6.prototype.clearPayload = function(name) {
  this.attrs[2].value = 0;
};

/**
 * @ngdoc service
 * @name flowsimUiApp.IPV6
 * @description
 * # IPV6
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('IPV6', function IPV6() {
    this.Payloads = Object.keys(Payloads);
    this.create = function() {
      return new _IPv6();
    };
  });
