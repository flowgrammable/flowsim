'use strict';

var macPattern = /([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}/;
var ipv4Pattern = /([0-9]{1,3}\.){3}[0-9]{1,3}/;

function validMac(mac) {
  return macPattern.test(mac);
}

function validIPv4(ipv4) {
  return ipv4Pattern.test(ipv4);
}

function _ARP() {
  this.name = 'ARP';
  this.attrs = [{
    name: 'Opcode',
    value: 0,
    test: function() { return true; },
    tip: 'ARP message type'
  }, {
    name: 'SHA',
    value: '00:00:00:00:00:00',
    test: validMac,
    tip: 'Source hardware address'
  }, {
    name: 'SPA',
    value: '0.0.0.0',
    test: validIPv4,
    tip: 'Source protocol address'
  }, {
    name: 'THA',
    value: '00:00:00:00:00:00',
    test: validMac,
    tip: 'Target hardware address'
  }, {
    name: 'TPA',
    value: '0.0.0.0',
    test: validIPv4,
    tip: 'Target protocol address'
  }];
}

_ARP.prototype.bytes = function() {
  return 28;
};

/**
 * @ngdoc service
 * @name flowsimUiApp.ARP
 * @description
 * # ARP
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('ARP', function ARP() {
    this.Payloads = [];
    this.create = function() {
      return new _ARP();
    };
  });

