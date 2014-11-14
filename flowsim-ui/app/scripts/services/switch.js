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
  if(_.isObject(sw)) {
    _.extend(this, sw);
    this.datapath = new Datapath.Datapath(sw.datapath);
    this.ports    = new Ports.Ports(sw.ports);
    this.tables   = new Tables.Tables(sw.tables);
    this.groups   = new Groups.Groups(sw.groups);
    //this.meters   = new Meters.Configuration(sw.meters);
  } else {
    this.name     = sw;
    this.datapath = new Datapath.Datapath(null, profile.datapath);
    this.ports    = new Ports.Ports(null, profile.ports);
    this.tables   = new Tables.Tables(null, profile.tables);
    this.groups   = new Groups.Groups(null, profile.groups);
    //this.meters   = new Meters.Configuration(null, profile.meters);
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

var TIPS = {
  Datapath: Datapath.TIPS,
  Ports: Ports.TIPS,
  Tables: Tables.TIPS,
  Groups: Groups.TIPS,
  Meters: Meters.TIPS
};

var TESTS = {
  Datapath: Datapath.TESTS,
  Ports: Ports.TESTS,
  Tables: Tables.TESTS,
  Groups: Groups.TESTS,
  Meters: Meters.TESTS
};

var RANGES = {
  Datapath: Datapath.RANGES,
  Ports: Ports.RANGES,
  Tables: Tables.RANGES,
  Groups: Groups.RANGES,
  Meters: Meters.RANGES
};

return {
  create: create,
  createUI: createUI,
  TIPS: TIPS,
  TESTS: TESTS,
  RANGES: RANGES
};

});
