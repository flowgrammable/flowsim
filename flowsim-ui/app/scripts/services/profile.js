'use strict';

angular.module('flowsimUiApp')
  .factory('Profile', function(fgConstraints, Datapath, Ports, Tables,
                               Meters, Groups) {

var TIPS = {};
var TESTS = {};

function Profile(p) {
  if(typeof p === 'string') {
    this.name = p;
    this.datapath = new Datapath.Capabilities();
    this.ports    = new Ports.Capabilities();
    this.tables   = new Tables.Capabilities();
    this.meters   = new Meters.Capabilities();
    this.groups   = new Groups.Capabilities();
  } else if(p) {
    if(!p instanceof Profile) {
      _.extend(this, p);
    }
    this.name     = p.name;
    this.datapath = new Datapath.Capabilities(p.datapath);
    this.ports    = new Ports.Capabilities(p.ports);
    this.tables   = new Tables.Capabilities(p.tables);
    this.meters   = new Meters.Capabilities(p.meters);
    this.groups   = new Groups.Capabilities(p.groups);
  } else {
    throw 'Bad construction: Profile';
  }
}
Profile.prototype.clone = function() {
  return new Profile(this);
};

var ProfileUI = Profile;
ProfileUI.prototype.toBase = Profile.prototype.clone;

TIPS.Datapath  = Datapath.TIPS;
TESTS.Datapath = Datapath.TESTS;
TIPS.Ports     = Ports.TIPS;
TESTS.Ports    = Ports.TESTS;
TIPS.Tables    = Tables.TIPS;
TESTS.Tables   = Tables.TESTS;
TIPS.Meters    = Meters.TIPS;
TESTS.Meters   = Meters.TESTS;
TIPS.Groups    = Groups.TIPS;
TESTS.Groups   = Groups.TESTS;

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

    function openflow_1_0(p) {
      console.log('preselecting 1.0');

      p.datapath.openflow_1_0();
      p.ports.openflow_1_0();
      //p.tables.openflow_1_0();
      p.meters.openflow_1_0();
      p.groups.openflow_1_0();

      // Tables
      /*var i;
      for (i = 0; i < p.tables.n_tables; i++) {
        // set relevant match fields:
        var table = p.tables.tables[i];
        var j;
        for (j = 0; j < table.match.fields.length; j++) {
          var f = table.match.fields[j];
          if (f.key === 'in_port') {
            f.enabled = true;
            f.wildcardable = true;
            f.maskable = false;
            f.mask = 0;
          }
          // ...
        }
      }*/

      // Groups

      // Meters

      //p.datapath.ip_reassembly = true;
      //p.ports.table = false

      return p
    }
    function openflow_1_1(p) {
      // openflow preseelect 1.1 code goes here
      console.log('preselecting 1.1');
      p.datapath.openflow_1_1();
      p.ports.openflow_1_1();
      //p.tables.openflow_1_1();
      p.meters.openflow_1_1();
      p.groups.openflow_1_1();
      p.ports.table = true;
      return p
    }
    function openflow_1_2(p) {
      // openflow preseelect 1.2 code goes here
      console.log('preselecting 1.2');
      p.datapath.openflow_1_2();
      p.ports.openflow_1_2();
      //p.tables.openflow_1_2();
      p.meters.openflow_1_2();
      p.groups.openflow_1_2();
      return p
    }
    function openflow_1_3(p) {
      // openflow preseelect 1.3 code goes here
      console.log('preselecting 1.3');
      p.datapath.openflow_1_3();
      p.ports.openflow_1_3();
      //p.tables.openflow_1_3();
      p.meters.openflow_1_3();
      p.groups.openflow_1_3();
      return p
    }
    function openflow_1_4(p) {
      // openflow preseelect 1.4 code goes here
      console.log('preselecting 1.4');
      p.datapath.openflow_1_4();
      p.ports.openflow_1_4();
      //p.tables.openflow_1_4();
      p.meters.openflow_1_4();
      p.groups.openflow_1_4();
      return p
    }

    return {
      create: create,
      createUI: createUI,
      openflow_1_0: openflow_1_0,
      openflow_1_1: openflow_1_1,
      openflow_1_2: openflow_1_2,
      openflow_1_3: openflow_1_3,
      openflow_1_4: openflow_1_4,
      TIPS: TIPS,
      TESTS: TESTS,
      MEDIUMS: Ports.MEDIUMS,
      MODES: Ports.MODES,
      SPEEDS: Ports.SPEEDS
    };

});
