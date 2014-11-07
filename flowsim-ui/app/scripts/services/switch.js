'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.switch
 * @description
 * # switch
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Switch', function(Datapath, Ports, Tables, Meters, Groups){

function Switch(sw, name, switchCapabilities) {
  if(sw instanceof Switch || typeof sw === 'object') {
    _.extend(this, s);
    //this.capabilities = ss.capabilities;
    this.datapath     = new Datapath.Configuration(sw.datapath);
    this.ports        = new Ports.Configuration(sw.ports);
    this.tables       = new Tables.Configuration(sw.tables);
    this.meters       = new Meters.Configuration(sw.meters);
    this.groups       = new Groups.Configuration(sw.groups);
  } else {
    this.name         = name;
    //this.capabilities = {};
    this.datapath     = new Datapath.Configuration(switchCapabilities.datapath);
    this.ports        = new Ports.Configuration(switchCapabilities.ports);
    this.tables       = new Tables.Configuration(switchCapabilities.tables);
    this.meters       = new Meters.Configuration(switchCapabilities.meters);
    this.groups       = new Groups.Configuration(switchCapabilities.groups);
  }
}

Switch.prototype.clone = function() {
  return new Switch(this);
};

var SwitchUI = Switch;
SwitchUI.prototype.toBase = Switch.prototype.clone;

function create(name, initialValue) {
    return new Switch(name, initialValue);
}

function createUI(swi, initialValue) {
  return new SwitchUI(swi, initialValue);
}

return {
    create: create,
    createUI: createUI
};

});
