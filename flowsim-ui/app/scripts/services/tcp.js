'use strict';

function _TCP() {
  this.name = 'TCP';
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

_TCP.prototype.bytes = function() {
  return 20;
};

/**
 * @ngdoc service
 * @name flowsimUiApp.TCP
 * @description
 * # TCP
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .service('TCP', function TCP() {
    this.Payloads = [];
    this.create = function() {
      return new _TCP();
    };
  });
