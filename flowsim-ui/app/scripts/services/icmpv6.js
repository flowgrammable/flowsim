'use strict';

function _ICMPv6() {
  this.name = 'ICMPv6';
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

_ICMPv6.prototype.bytes = function() {
  return 4; //+ addition things
};

/**
 * @ngdoc service
 * @name flowsimUiApp.ICMPV6
 * @description
 * # ICMPV6
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('ICMPV6', function ICMPV6() {
    this.Payloads = [];
    this.create = function() {
      return new _ICMPv6();
    };
  });
