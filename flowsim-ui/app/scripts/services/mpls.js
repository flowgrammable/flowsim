'use strict';

function MPLS() {
}

MPLS.prototype.bytes = function() {
};

/**
 * @ngdoc service
 * @name flowsimUiApp.MPLS
 * @description
 * # MPLS
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('MPLS', function MPLS() {
    this.Payloads = [];
    this.create = function() {
      return new MPLS();
    };
  });
