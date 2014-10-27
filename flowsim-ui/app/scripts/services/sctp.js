'use strict';

(function(){

var Payloads = {
 'Payload': 0
};

function _SCTP() {
  this.name = 'SCTP';
  this.attrs = [{
    name: 'Src',
    value: 0,
    test: fgConstraints.isUInt(0, 0xffff),
    tip: 'Source port'
  }, {
    name: 'Dst',
    value: 0,
    test: fgConstraints.isUInt(0, 0xffff),
    tip: 'Destination port'
  }];
}

_SCTP.prototype.bytes = function() {
  return 12;
};

_SCTP.prototype.setPayload = function() {};
_SCTP.prototype.clearPayload = function() {};

/**
 * @ngdoc service
 * @name flowsimUiApp.SCTP
 * @description
 * # SCTP
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('SCTP', function SCTP() {
    this.Payloads = Object.keys(Payloads);
    this.create = function() {
      return new _SCTP();
    };
  });

})();

