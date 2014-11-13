'use strict';

angular.module('flowsimUiApp')
  .factory('Profile', function(Datapath, Ports, Tables, Meters, Groups) {

function Profile(profile) {
  if(_.isObject(profile)) {
    _.extend(this, profile);
    this.datapath = new Datapath.Profile(profile.datapath);
    this.ports    = new Ports.Profile(profile.ports);
    this.tables   = new Tables.Profile(profile.tables);
    this.groups   = new Groups.Profile(profile.groups);
    this.meters   = new Meters.Capabilities(profile.meters);
  } else {
    this.name     = profile;
    this.datapath = new Datapath.Profile();
    this.ports    = new Ports.Profile(null, this.datapath.getMACPrefix());
    this.tables   = new Tables.Profile();
    this.groups   = new Groups.Profile();
    this.meters   = new Meters.Capabilities();
  }
}

Profile.prototype.clone = function() {
  return new Profile(this);
};

Profile.prototype.ofp_1_0 = function() {
  this.datapath.ofp_1_0();
  this.ports.ofp_1_0();
  this.tables.ofp_1_0();
  this.groups.ofp_1_0();
  this.meters.ofp_1_0();
};

Profile.prototype.ofp_1_1 = function() {
  this.datapath.ofp_1_1();
  this.ports.ofp_1_1();
  this.tables.ofp_1_1();
  this.groups.ofp_1_1();
  this.meters.ofp_1_1();
};

Profile.prototype.ofp_1_2 = function() {
  this.datapath.ofp_1_2();
  this.ports.ofp_1_2();
  this.tables.ofp_1_2();
  this.groups.ofp_1_2();
  this.meters.ofp_1_2();
};

Profile.prototype.ofp_1_3 = function() {
  this.datapath.ofp_1_3();
  this.ports.ofp_1_3();
  this.tables.ofp_1_3();
  this.groups.ofp_1_3();
  this.meters.ofp_1_3();
};

Profile.prototype.ofp_1_4 = function() {
  this.datapath.ofp_1_4();
  this.ports.ofp_1_4();
  this.tables.ofp_1_4();
  this.groups.ofp_1_4();
  this.meters.ofp_1_4();
};

/* ... this is super ugly .... */
var ProfileUI = Profile;
ProfileUI.prototype.toBase = Profile.prototype.clone;
/* ... .end of super ugly .... */

var TIPS = {
  Datapath: Datapath.TIPS,
  Ports:    Ports.TIPS,
  Tables:   Tables.TIPS,
  Meters:   Meters.TIPS,
  Groups:   Groups.TIPS
};

var TESTS = {
  Datapath: Datapath.TESTS,
  Ports:    Ports.TESTS,
  Tables:   Tables.TESTS,
  Meters:   Meters.TESTS,
  Groups:   Groups.TESTS
};

var RANGES = {
  Datapath: Datapath.RANGES,
  Ports:    Ports.RANGES,
  Tables:   Tables.RANGES,
  Meters:   Meters.RANGES,
  Groups:   Groups.RANGES
};

/**
 * @ngdoc service
 * @name flowsimUiApp.profile
 * @description
 * # profile
 * Service in the flowsimUiApp.
 */

function create(name) {
  return new Profile(name);
}

function createUI(profile) {
  return new ProfileUI(profile);
}

return {
  create: create,
  createUI: createUI,
  TIPS: TIPS,
  TESTS: TESTS,
  RANGES: RANGES
};

});
