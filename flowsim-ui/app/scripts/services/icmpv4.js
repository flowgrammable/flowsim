'use strict';

function _ICMPv4() {
  this.name = 'ICMPv4';
  this.attrs = [];
}

_ICMPv4.prototype.bytes = function() {
  return 0;
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
