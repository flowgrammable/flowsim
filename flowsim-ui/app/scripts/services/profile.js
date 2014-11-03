'use strict';

angular.module('flowsimUiApp')
  .factory('Profile', function(fgConstraints, Datapath, Ports,
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

TIPS.match = {
  in_port: 'Match on ingress port',
  eth_src: 'Match on Ethernet source address',
  eth_dst: 'Match on Ethernet destination address',
  eth_typelen: 'Match on Ethernet type/length field',
  arp_opcode: 'Match on ARP message type',
  arp_sha: 'Match on Source hardware address',
  arp_spa: 'Match on Source protocol address',
  arp_tha: 'Match on Target hardware address',
  arp_tpa: 'Match on Target protocol address',
  vlan_pcp: 'Match on VLAN priority code',
  vlan_dei: 'Match on VLAN',
  vlan_vid: 'Match on VLAN ID',
  vlan_typelen: 'Match on VLAN Type/Len',
  mpls_label: 'Match on MPLS label',
  mpls_tc: 'Match on MPLS tc',
  mpls_bos: 'Match on MPLS bos',
  ipv4_dscp: 'Match on IPv4 Differentiated Services Code Type',
  ipv4_ecn: 'Match on Explicit Congestion Notification',
  ipv4_proto: 'Match on Protocol',
  ipv4_src: 'Match on IPv4 source',
  ipv4_dst: 'Match on IPv4 destination'

};
TESTS.match = {
  in_port: fgConstraints.isUInt(0, 0xffffffff),
  eth_src: fgConstraints.isUInt(0, 0xffffffffffff),
  eth_dst: fgConstraints.isUInt(0, 0xffffffffffff),
  eth_typelen: fgConstraints.isUInt(0, 0xffff),
  arp_opcode: fgConstraints.isUInt(0, 0x1),
  arp_sha: fgConstraints.isUInt(0, 0xffffffffffff),
  arp_spa: fgConstraints.isUInt(0, 0xffffffff),
  arp_tha: fgConstraints.isUInt(0, 0xffffffffffff),
  arp_tpa: fgConstraints.isUInt(0, 0xffffffff),
  vlan_pcp: fgConstraints.isUInt(0, 0x7),
  vlan_dei: fgConstraints.isUInt(0, 0x3),
  vlan_vid: fgConstraints.isUInt(0, 0x0fff),
  vlan_typelen: fgConstraints.isUInt(0, 0xffff),
  mpls_label: fgConstraints.isUInt(0, 0x0fffff),
  mpls_tc: fgConstraints.isUInt(0, 0x7),
  mpls_bos: fgConstraints.isUInt(0, 0x0fffff),
  ipv4_dscp: fgConstraints.isUInt(0, 0x3f),
  ipv4_ecn: fgConstraints.isUInt(0, 0x03),
  ipv4_proto: fgConstraints.isUInt(0, 255),
  ipv4_src: fgConstraints.isUInt(0, 0xffffffff),
  ipv4_dst: fgConstraints.isUInt(0, 0xffffffff)
};

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

TIPS.instruction = {
  apply: 'Applies actions immediately',
  clear: 'Clears the action set',
  write: 'Appends actions to the action set',
  metadata: 'Writes metadata register',
  meter: 'Sends packet to designated meter',
  goto_: 'Jumps to another flow table'
};
TESTS.instruction = {
  metadata: fgConstraints.isUInt(0, 0xffffffffffffffff),
  goto_: function(input) {
    return /^([0-9]+)(\.\.([0-9]+))?$/.test(input);
  }
};

var Miss = Instruction;

function Table(table) {
if(typeof table === 'number') {
    this.table_id    = table;
    this.name        = 'table' + this.table_id;
    this.max_entries = 256;
    this.table_stats = true;
    this.flow_stats  = true;
    this.match       = new Match();
    this.instruction = new Instruction();
    this.miss        = new Miss();
  } else {
    this.table_id    = table.table_id;
    this.name        = table.name;
    this.max_entries = table.max_entries;
    this.table_stats = table.table_stats;
    this.flow_stats  = table.flow_stats;
    this.match       = new Match(table.match);
    this.instruction = new Instruction(table.instruction);
    this.miss        = new Miss(table.miss);
  }
}

TIPS.table = {
  table_id: 'Unique table identifier',
  name: 'Descriptive name for flow table type',
  max_entries: 'Maximum flows supported',
  table_stats: 'Ability of table to record lookup statistics',
  flow_stats: 'Ability of flow to record match statistics',
  flow_caps: 'Match, Instruction, and Actions to support'
};
TESTS.table = {
  name: function(n) { return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(n); },
  max_entries: fgConstraints.isUInt(0,0xffffffff)
};

function Tables(tables) {
if(tables /*&& tables instanceof Tables*/) {
    this.n_tables = tables.n_tables;
    this.tables = _.map(tables.tables, function(t) { return new Table(t); });
  } else {
    this.n_tables = 8;
    this.tables = _.map(_.range(this.n_tables), function(id) {
      return new Table(id);
    });
  }
}

Tables.prototype.rebuild = function() {
  var i;
  if(this.n_tables === this.tables.length) {
    return;
  } else if(this.n_tables < this.tables.length) {
    this.tables.splice(this.n_tables, this.tables.length-this.n_tables);
  } else {
    for(i=this.tables.length; i<this.n_tables; ++i) {
      this.tables.push(new Table(i));
    }
  }
};

TIPS.tables = {
  n_tables: 'Number of flow tables available'
};
TESTS.tables = {
  n_tables: fgConstraints.isUInt(0,0xff)
};

function Profile(p) {
  if(typeof p === 'string') {
    this.name = p;
    this.datapath = new Datapath.Capabilities();
    this.ports    = new Ports.Capabilities();
    this.tables   = new Tables();
    this.meters   = new Meters.Capabilities();
    this.groups   = new Groups.Capabilities();
  } else if(p) {
    if(!p instanceof Profile) {
      _.extend(this, p);
    }
    this.name     = p.name;
    this.datapath = new Datapath.Capabilities(p.datapath);
    this.ports    = new Ports.Capabilities(p.ports);
    this.meters   = new Meters(p.meters);
    this.tables   = new Tables.Capabilities(p.tables);
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
      p.ports.table = true;
      return p
    }
    function openflow_1_2(p) {
      // openflow preseelect 1.2 code goes here
      console.log('preselecting 1.2');
      return p
    }
    function openflow_1_3(p) {
      // openflow preseelect 1.3 code goes here
      console.log('preselecting 1.3');
      return p
    }
    function openflow_1_4(p) {
      // openflow preseelect 1.4 code goes here
      console.log('preselecting 1.4');
      p.datapath.openflow_1_4();
      p.ports.openflow_1_4();
      p.tables.openflow_1_4();
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
