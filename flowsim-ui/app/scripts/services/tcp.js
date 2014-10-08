'use strict';

function TCP() {
}

TCP.prototype.bytes = function() {
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
      return new TCP();
    };
  });
