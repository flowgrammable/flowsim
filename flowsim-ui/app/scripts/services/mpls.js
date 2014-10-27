'use strict';

(function(){

var Payloads = {
  'Payload': 0
};

function _MPLS() {
  this.name = 'MPLS';
  this.attrs = [{
    name: 'Label',
    value: 0,
    test: fgConstraints.isUInt(0, 0x0fffff),
    tip: 'MPLS Label'
  }, {
    name: 'TC',
    value: 0,
    test: fgConstraints.isUInt(0, 7),
    tip: 'Traffic Control'
  }, {
    name: 'BoS',
    value: 0,
    test: fgConstraints.isUInt(0, 1),
    tip: 'Botom of Stack'
  }];
}

_MPLS.prototype.bytes = function() {
  return 4;
};

_MPLS.prototype.setPayload = function(name) {};
_MPLS.prototype.clearPayload = function() {}

/**
 * @ngdoc service
 * @name flowsimUiApp.MPLS
 * @description
 * # MPLS
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('MPLS', function MPLS() {
    this.Payloads = Object.keys(Payloads);
    this.create = function() {
      return new _MPLS();
    };
  });

})();

