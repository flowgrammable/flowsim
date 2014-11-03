'use strict';

angular.module('flowsimUiApp')
  .factory('Profile', function(fgConstraints, Datapath, Ports, Tables,
                               Meters, Groups) {

var TIPS = {};
var TESTS = {};

function createMatch(protocol, field, key, wildcard, maskable, mask) {
  return {
    protocol: protocol,
    field: field,
    key: key,
    enabled: true,
    wildcardable: wildcard,
    maskable: maskable,
    mask: mask
  };
}

function Match(match) {
if(match /*&& match instanceof Match*/) {
    this.fields = _.map(match.fields, function(f) { return _.clone(f); });
  } else {
    this.fields = [
      createMatch('Ingress', 'Port', 'in_port', true, false, 0),
      createMatch('Ethernet', 'Src', 'eth_src', true, true, '0xffffffffffff'),
      createMatch('Ethernet', 'Dst', 'eth_dst', true, true, '0xffffffffffff'),
      createMatch('Ethernet', 'Type/Len', 'eth_typelen', true, false, '0xffff'),
      createMatch('ARP', 'Opcode', 'arp_opcode', true, false, 0),
      createMatch('ARP', 'SHA', 'arp_sha', true, false, '0xffffffffffff'),
      createMatch('ARP', 'SPA', 'arp_spa', true, true, '0xffffffff'),
      createMatch('ARP', 'THA', 'arp_tha', true, true, '0xffffffffffff'),
      createMatch('ARP', 'TPA', 'arp_tpa', true, true, '0xffffffff'),
      createMatch('VLAN', 'PCP', 'vlan_pcp', true, true, '0x7'),
      createMatch('VLAN', 'DEI', 'vlan_dei', true, true, '0x3'),
      createMatch('VLAN', 'VID', 'vlan_vid', true, true, '0x0fff'),
      createMatch('VLAN', 'Type/Len', 'vlan_typelen', true, true, '0xffff'),
      createMatch('MPLS', 'Label', 'mpls_label', true, true, '0x0fffff'),
      createMatch('MPLS', 'Traffic Control', 'mpls_tc', true, true, '0x7'),
      createMatch('MPLS', 'BOS', 'mpls_bos', true, true, '0x0fffff'),
      createMatch('IPv4', 'DSCP', 'ipv4_dscp', true, true, '0x3f'),
      createMatch('IPv4', 'ECN', 'ipv4_ecn', true, true, '0x03'),
      createMatch('IPv4', 'Proto', 'ipv4_proto', true, true, '0xff'),
      createMatch('IPv4', 'Src', 'ipv4_src', true, true, '0xffffffff'),
      createMatch('IPv4', 'Dst', 'ipv4_dst', true, true, '0xffffffff')

    ];
  }
}

function mkActionField(name, value) {
  return {
    name: name,
    value: value
  };
}

function Instruction(ins) {
  if(ins && ins instanceof Instruction) {
    this.caps = _.clone(ins.caps);
    this.apply = _.map(ins.apply, function(i) {
      return {
        protocol: i.protocol,
        fields: _.map(i.fields, function(j) {
          return _.clone(j);
        })
      };
    });
    this.write = _.map(ins.write, function(i) {
      return {
        protocol: i.protocol,
        fields: _.map(i.fields, function(j) {
          return _.clone(j);
        })
      };
    });
    this.metadata = ins.metadata;
    this.goto_ = _.map(ins.goto_, function(i) {
      return _.clone(i);
    });
  } else {
    this.caps = {
      apply    : true,
      clear    : true,
      write    : true,
      metadata : true,
      meter    : true,
      goto_    : true
    };
    this.apply = [{
      protocol: 'Internal',
      fields: [
        mkActionField('Output', true),
        mkActionField('Group', true)
      ]
    }, {
      protocol: 'Ethernet',
      fields: [
        mkActionField('Src write', true),
        mkActionField('Dst write', true),
        mkActionField('Typelen write', true)
      ]
    }, {
      protocol: 'ARP',
      fields: [
        mkActionField('Opcode write', true),
        mkActionField('SHA write', true),
        mkActionField('SPA write', true)
      ]
    }, {
      protocol: 'MPLS',
      fields: []
    }, {
      protocol: 'ARP',
      fields: []
    }, {
      protocol: 'IPv4',
      fields: [
      ]
    }, {
      protocol: 'IPv6',
      fields: [
      ]
    }, {
      protocol: 'ICMPv4',
      fields: [
      ]
    }, {
      protocol: 'ICMPv6',
      fields: [
      ]
    }, {
      protocol: 'TCP',
      fields: [
      ]
    }, {
      protocol: 'SCTP',
      fields: [
      ]
    }, {
      protocol: 'TCP',
      fields: [
      ]
    }];
    this.write = [{
      protocol: 'Internal',
      fields: [
        mkActionField('Output', true),
        mkActionField('Group', true)
      ]
    }, {
      protocol: 'Ethernet',
      fields: [
        mkActionField('Src write', true),
        mkActionField('Dst write', true)
      ]
    }, {
      protocol: 'ARP',
      fields: []
    }, {
      protocol: 'MPLS',
      fields: []
    }, {
      protocol: 'ARP',
      fields: []
    }, {
      protocol: 'IPv4',
      fields: [
      ]
    }, {
      protocol: 'IPv6',
      fields: [
      ]
    }, {
      protocol: 'ICMPv4',
      fields: [
      ]
    }, {
      protocol: 'ICMPv6',
      fields: [
      ]
    }, {
      protocol: 'TCP',
      fields: [
      ]
    }, {
      protocol: 'SCTP',
      fields: [
      ]
    }, {
      protocol: 'TCP',
      fields: [
      ]
    }];
    this.metadata = '0xffffffffffffffff';
    this.goto_ = [];
  }
}

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

TIPS.datapath  = Datapath.TIPS;
TESTS.datapath = Datapath.TESTS;
TIPS.ports     = Ports.TIPS;
TESTS.ports    = Ports.TESTS;
TIPS.tables    = Tables.TIPS;
TESTS.tables   = Tables.TESTS;
TIPS.meters    = Meters.TIPS;
TESTS.meters   = Meters.TESTS;
TIPS.groups    = Groups.TIPS;
TESTS.groups   = Groups.TESTS;

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

      // Ports
      p.ports.vports = {
        port_stats: true,
        stp:        true, // optional
        in_port:    true,
        table:      true,
        normal:     true, // optional
        flood:      true, // optional
        all:        true,
        controller: true,
        local:      true,
        any:        false,
        none:       true
      };

      // Tables
      var i;
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
      }

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
