'use strict';

(function(){

var Payloads = {
 'Payload': 0
};

function _UDP() {
  this.name = 'UDP';
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

_UDP.prototype.bytes = function() {
  return 8;
};

_UDP.prototype.setPayload = function() {};
_UDP.prototype.clearPayload = function() {};

/**
 * @ngdoc service
 * @name flowsimUiApp.UDP
 * @description
 * # UDP
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('UDP', function UDP() {
    this.Payloads = Object.keys(Payloads);
    this.create = function() {
      return new _UDP();
    };
  });

})();

