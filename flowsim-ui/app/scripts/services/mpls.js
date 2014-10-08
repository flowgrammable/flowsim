'use strict';

function _MPLS() {
  this.name = 'MPLS';
  this.attrs = [];
}

_MPLS.prototype.bytes = function() {
  return 0;
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
      return new _MPLS();
    };
  });
