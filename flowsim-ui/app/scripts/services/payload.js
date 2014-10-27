'use strict';

(function() {

function _Payload() {
  this.name = 'Payload';
  this.attrs = [{
    name: 'Bytes',
    value: 0,
    test: fgConstraints.isUInt(0,0xffff),
    tip: 'Arbitrary payload size in bytes'
  }];
};

_Payload.prototype.bytes = function() {
  return this._bytes;
};

angular.module('flowsimUiApp')
  .service('PAYLOAD', function PAYLOD() {
    this.create = function() {
      return new _Payload();
    }
  });

})();


