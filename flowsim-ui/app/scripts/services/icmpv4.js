'use strict';

function _ICMPv4() {
  this.name = 'ICMPv4';
  this.attrs = [{
    name: 'Type',
    value: 0,
    test: fgConstraints.isUInt(0, 0xff),
    tip: 'ICMP message type'
  }, {
    name: 'Code',
    value: 0,
    test: fgConstraints.isUInt(0, 0xff),
    tip: 'ICMP message code'
  }];
}

_ICMPv4.prototype.bytes = function() {
  return 4; // + size of payload
};

/**
 * @ngdoc service
 * @name flowsimUiApp.ICMPV4
 * @description
 * # ICMPV4
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('ICMPV4', function ICMPV4() {
    this.Payloads = [];
    this.create = function() {
      return new _ICMPv4();
    };
  });
