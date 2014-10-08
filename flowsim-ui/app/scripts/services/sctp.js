'use strict';

function SCTP() {
}

SCTP.prototype.bytes = function() {
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
      return new SCTP();
    };
  });
