'use strict';

function IPv4() {
}

IPv4.prototype.bytes = function() {
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
    this.Payloads = [
      'ICMPv4',
      'TCP',
      'UDP',
      'SCTP'
    ];
    this.create = function() {
      return new IPv4();
    };
  });
