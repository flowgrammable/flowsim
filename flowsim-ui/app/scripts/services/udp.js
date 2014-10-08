'use strict';

function _UDP() {
  this.name = 'UDP';
  this.attrs = [];
}

_UDP.prototype.bytes = function() {
  return 8;
};

/**
 * @ngdoc service
 * @name flowsimUiApp.UDP
 * @description
 * # UDP
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('UDP', function UDP() {
    this.Payloads = [];
    this.create = function() {
      return new _UDP();
    };
  });
