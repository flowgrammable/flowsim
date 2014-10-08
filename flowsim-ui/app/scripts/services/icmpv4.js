'use strict';

function ICMPv4() {
}

ICMPv4.prototype.bytes = function() {
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
      return new ICMPv4();
    };
  });
