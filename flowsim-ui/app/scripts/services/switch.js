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
    this.datapath = new Datapath.Capabilities(switchCapabilities.datapath);
    this.ports    = new Ports.Capabilities(switchCapabilities.ports);
    this.tables   = new Tables.Capabilities(switchCapabilities.tables);
    this.meters   = new Meters.Capabilities(switchCapabilities.meters);
    this.groups   = new Groups.Capabilities(switchCapabilities.groups);
  } else {
    _.extend(this, s);
    this.datapath = new Datapath.Capabilities(s.datapath);
    this.ports    = new Ports.Capabilities(s.ports);
    this.tables   = new Tables.Capabilities(s.tables);
    this.meters   = new Meters.Capabilities(s.meters);
    this.groups   = new Groups.Capabilities(s.groups);
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
