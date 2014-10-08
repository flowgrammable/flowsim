'use strict';

(function(){

var ipv4Pattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;

function isIPv4(ipv4) {
  return ipv4Pattern.test(ipv4) &&
    _.every(ipv4.split('.'), fgConstraints.isUInt(0, 255));
}

var Payloads = {
  'ICMPv4': 1,
  'TCP'   : 6,
  'UDP'   : 17,
  'SCTP'  : 132
};

function _IPv4() {
  this.name = 'IPv4';
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
    test: isIPv4,
    tip: 'Source Address'
  }, {
    name: 'Dst',
    value: '0.0.0.0',
    test: isIPv4,
    tip: 'Destination Address'
  }];
}

_IPv4.prototype.bytes = function() {
  return 20;
};

_IPv4.prototype.setPayload = function(name) {
  this.attrs[2].value = Payloads[name] || 0;
};

_IPv4.prototype.clearPayload = function() {
  this.attrs[2].value = 0;
};

/**
 * @ngdoc service
 * @name flowsimUiApp.IPV4
 * @description
 * # IPV4
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('IPV4', function IPV4() {
    this.Payloads = Object.keys(Payloads);
    this.create = function() {
      return new _IPv4();
    };
  });

})();

