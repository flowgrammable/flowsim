'use strict';

function IPv6() {
}

IPv6.prototype.bytes = function() {
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
    this.Payloads = [
      'ICMPv6',
      'TCP',
      'UDP',
      'SCTP'
    ];
    this.create = function() {
      return new IPv6();
    };
  });
