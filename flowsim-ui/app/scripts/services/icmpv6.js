'use strict';

function _ICMPv6() {
  this.name = 'ICMPv6';
  this.attrs = [];
}

_ICMPv6.prototype.bytes = function() {
  return 0;
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
