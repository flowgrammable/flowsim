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
