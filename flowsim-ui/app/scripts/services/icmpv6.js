'use strict';

function ICMPv6() {
}

ICMPv6.prototype.bytes = function() {
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
      return new ICMPv6();
    };
  });
