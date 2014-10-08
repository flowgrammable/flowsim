'use strict';

function _IPv6() {
  this.name = 'IPv6';
  this.attrs = [];
}

_IPv6.prototype.bytes = function() {
  return 0;
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
      return new _IPv6();
    };
  });
