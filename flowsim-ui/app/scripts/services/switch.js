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

function SwitchUI(name, obj) {
  this.name = name;
  if(obj === undefined) {
  } else {
    // Switch type
  }
}

angular.module('flowsimUiApp')
  .factory('Switch', function() {

    function create(name) {
      return new Switch(name);
    }

    function createUI(name, obj) {
      return new SwitchUI(name, obj);
    }

    return {
      create: create,
      createUI: createUI
    };
  });
