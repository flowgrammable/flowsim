'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.switch
 * @description
 * # switch
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Switch', function(){

function Switch(name) {
  this.name = name;
}

function SwitchUI(swi) {
  if(typeof swi === 'string'){
    this.name = swi;
  } else {
    this.name = swi.name;
  }
}

SwitchUI.prototype.toBase = function() {
  var result = new Switch(this.name);
  return result;
};

function create(name) {
    return new Switch(name);
}

function createUI(swi) {
  return new SwitchUI(swi);
}

return {
    create: create,
    createUI: createUI
};

});
