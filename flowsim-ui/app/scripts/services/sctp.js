'use strict';

function _SCTP() {
  this.name = 'SCTP';
  this.attrs = [];
}

_SCTP.prototype.bytes = function() {
  return 0;
};

/**
 * @ngdoc service
 * @name flowsimUiApp.SCTP
 * @description
 * # SCTP
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('SCTP', function SCTP() {
    this.Payloads = [];
    this.create = function() {
      return new _SCTP();
    };
  });
