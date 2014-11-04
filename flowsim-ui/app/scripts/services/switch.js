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

function Switch(s, switchCapabilities) {
  if(typeof s === 'string') {
    this.name = s;
    this.datapath = new Datapath.Configuration(switchCapabilities.datapath);
    this.ports    = new Ports.Configuration(switchCapabilities.ports);
    this.tables   = new Tables.Configuration(switchCapabilities.tables);
    this.meters   = new Meters.Configuration(switchCapabilities.meters);
    this.groups   = new Groups.Configuration(switchCapabilities.groups);
  } else {
    _.extend(this, s);
    this.datapath = new Datapath.Configuration(s.datapath);
    this.ports    = new Ports.Configuration(s.ports);
    this.tables   = new Tables.Configuration(s.tables);
    this.meters   = new Meters.Configuration(s.meters);
    this.groups   = new Groups.Configuration(s.groups);
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
