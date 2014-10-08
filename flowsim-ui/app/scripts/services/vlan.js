'use strict';

function _VLAN() {
  this.name = 'VLAN';
  this.attrs = [];
}

_VLAN.prototype.bytes = function() {
  return 4;
};

/**
 * @ngdoc service
 * @name flowsimUiApp.VLAN
 * @description
 * # VLAN
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('VLAN', function VLAN() {
    this.Payloads = [
      'VLAN',
      'MPLS',
      'ARP',
      'IPv4',
      'IPv6'
    ];
    this.create = function() {
      return new _VLAN();
    };
  });
