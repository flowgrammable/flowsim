'use strict';

var macPattern = /^([a-fA-F0-9]{1,2}(-|:)){5}[a-fA-F0-9]{1,2}$/;
var ipv4Pattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;

function isMAC(addr) {
  return macPattern.test(addr);
}

function isIPv4(ipv4) {
  return ipv4Pattern.test(ipv4) && 
         _.every(ipv4.split('.'), fgConstraints.isUInt(0, 255));
}

function _ARP() {
  this.name = 'ARP';
  this.attrs = [{
    name: 'Opcode',
    value: 0,
    test: fgConstraints.isUInt(0, 1),
    tip: 'ARP message type'
  }, {
    name: 'SHA',
    value: '00:00:00:00:00:00',
    test: isMAC,
    tip: 'Source hardware address'
  }, {
    name: 'SPA',
    value: '0.0.0.0',
    test: isIPv4,
    tip: 'Source protocol address'
  }, {
    name: 'THA',
    value: '00:00:00:00:00:00',
    test: isMAC,
    tip: 'Target hardware address'
  }, {
    name: 'TPA',
    value: '0.0.0.0',
    test: isIPv4,
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

