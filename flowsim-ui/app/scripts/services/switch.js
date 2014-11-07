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

function Switch(sw, profile) {
  if(sw instanceof Switch || (typeof sw === 'object' && sw !== null)) {
    _.extend(this, sw);
    this.datapath = new Datapath.Configuration(sw.datapath);
    //this.ports    = new Ports.Configuration(sw.ports);
    this.tables   = new Tables.Configuration(sw.tables);
    //this.meters   = new Meters.Configuration(sw.meters);
    //this.groups   = new Groups.Configuration(sw.groups);
  } else {
    this.name     = sw;
    this.datapath = new Datapath.Configuration(null, profile.datapath);
    //this.ports    = new Ports.Configuration(null, profile.ports);
    this.tables   = new Tables.Configuration(null, profile.tables);
    //this.meters   = new Meters.Configuration(null, profile.meters);
    //this.groups   = new Groups.Configuration(null, profile.groups);
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
