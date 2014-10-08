'use strict';

function UDP() {
}

UDP.prototype.bytes = function() {
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
      return new UDP();
    };
  });
