'use strict';

function VLAN() {
}

VLAN.prototype.bytes = function() {
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
      return new VLAN();
    };
  });
