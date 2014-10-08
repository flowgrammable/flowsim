'use strict';

function _IPv4() {
  this.name = 'IPv4';
  this.attrs = [];
}

_IPv4.prototype.bytes = function() {
  return 0;
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
      return new _IPv4();
    };
  });
