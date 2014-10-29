'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.switch
 * @description
 * # switch
 * Service in the flowsimUiApp.
 */

function Switch(name) {
  this.name = name;
}

function SwitchUI(sw) {
  this.name = sw.name;
}

SwitchUI.prototype.toBase = function() {
  var result = new Switch(this.name);
  return result;
};

angular.module('flowsimUiApp')
  .factory('Switch', function() {

    function create(name) {
      return new Switch(name);
    }

    function createUI(sw) {
      return new SwitchUI(sw);
    }

    return {
      create: create,
      createUI: createUI
    };
  });
