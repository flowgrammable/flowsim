'use strict';

angular.module('flowsimUiApp')
  .factory('Profile', function(Datapath, Ports, Tables, Meters, Groups) {

function Profile(profile) {
  if(_.isObject(profile)) {
    _.extend(this, profile);
    this.datapath = new Datapath.Capabilities(profile.datapath);
    this.ports    = new Ports.Capabilities(profile.ports);
    this.tables   = new Tables.Capabilities(profile.tables);
    this.meters   = new Meters.Capabilities(profile.meters);
    this.groups   = new Groups.Capabilities(profile.groups);
  } else {
    this.name     = profile;
    this.datapath = new Datapath.Capabilities();
    this.ports    = new Ports.Capabilities(null, this.datapath.getMACPrefix());
    this.tables   = new Tables.Capabilities();
    this.meters   = new Meters.Capabilities();
    this.groups   = new Groups.Capabilities();
  }
}

Profile.prototype.clone = function() {
  return new Profile(this);
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

    function ofp_1_0(p) {
      // openflow preseelect 1.0 code goes here
      p.datapath.ofp_1_0();
      p.ports.ofp_1_0();
      p.tables.openflow_1_0();
      p.meters.openflow_1_0();
      p.groups.openflow_1_0();

      return p
    }
    function ofp_1_1(p) {
      // openflow preseelect 1.1 code goes here
      p.datapath.ofp_1_1();
      p.ports.ofp_1_1();
      p.tables.openflow_1_1();
      p.meters.openflow_1_1();
      p.groups.openflow_1_1();
      //p.ports.table = true;     <--- this should be done inside of ports
      return p
    }
    function ofp_1_2(p) {
      // openflow preseelect 1.2 code goes here
      p.datapath.ofp_1_2();
      p.ports.ofp_1_2();
      p.tables.openflow_1_2();
      p.meters.openflow_1_2();
      p.groups.openflow_1_2();
      return p
    }
    function ofp_1_3(p) {
      // openflow preseelect 1.3 code goes here
      p.datapath.ofp_1_3();
      p.ports.ofp_1_3();
      p.tables.openflow_1_3();
      p.meters.openflow_1_3();
      p.groups.openflow_1_3();
      return p
    }
    function ofp_1_4(p) {
      // openflow preseelect 1.4 code goes here
      p.datapath.ofp_1_4();
      p.ports.ofp_1_4();
      p.tables.openflow_1_4();
      p.meters.openflow_1_4();
      p.groups.openflow_1_4();
      return p
    }

    return {
      create: create,
      createUI: createUI,
      openflow_1_0: ofp_1_0,
      openflow_1_1: ofp_1_1,
      openflow_1_2: ofp_1_2,
      openflow_1_3: ofp_1_3,
      openflow_1_4: ofp_1_4,
      TIPS: TIPS,
      TESTS: TESTS,
      MEDIUMS: Ports.MEDIUMS,
      MODES: Ports.MODES,
      SPEEDS: Ports.SPEEDS
    };

});
