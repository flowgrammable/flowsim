'use strict';

angular.module('flowsimUiApp')
  .factory('Profile', function(ETHERNET, fgConstraints) {

var TIPS = {};
var TESTS = {};

function Datapath(dp) {
  // Copy constructor
if(dp /*&& dp instanceof Datapath*/) {
    this.datapath_id   = dp.datapath_id;
    this.ip_reassembly = dp.ip_reassembly;
    this.n_buffers     = dp.n_buffers;

    this.mfr_description   = dp.mfr_description;
    this.hw_description    = dp.hw_description;
    this.sw_description    = dp.sw_description;
    this.serial_num = dp.serial_num;
    this.dp_description    = dp.dp_description;
  }
  // Default constructor
  else {
    this.datapath_id   = '01:23:45:67:89:ab'; // FIXME: bad default
    this.n_buffers     = 1024;
    this.ip_reassembly = true;

    // Descriptions
    this.mfr_description = '';
    this.hw_description  = '';
    this.sw_description  = '';
    this.serial_num      = '';
    this.dp_description  = '';
  }
}

Datapath.prototype.clone = function() {
  return new Datapath(this);
};

var DatapathUI = Datapath;
DatapathUI.prototype.toBase = Datapath.prototype.clone;

TIPS.datapath = {
  datapath_id: 'Unique id of the datapath',
  ip_reassembly: 'Datapath can reassemble IP fragments',
  n_buffers: 'Number of packets that can be buffered for controller',
  mfr_description: '',
  hw_description: '',
  sw_description: '',
  serial_num: '',
  dp_description: ''
};

TESTS.datapath = {
  datapath_id: function() { return true; },
  n_buffers:   fgConstraints.isUInt(0, 0xffff),
  mfr_description:    function(v) { return !v || v.length <= 256 ; },
  hw_description:     function(v) { return !v || v.length <= 256; },
  sw_description:     function(v) { return !v || v.length <= 256; },
  serial_num:  function(v) { return !v || v.length <= 32; },
  dp_description:     function(v) { return !v || v.length <= 256; }
};

function Port(p) {
  // Copy constructor
if(p /*&& p instanceof Port*/) {
    this.port_id = p.port_id;
    this.mac     = p.mac;
    this.name    = p.name;
    this.speed   = p.speed;
    this.mode    = p.mode;
    this.medium  = p.medium;
  } else {
    if(p && typeof p === 'number') {
      this.port_id = p;
    } else {
      this.port_id = 0
    }
    this.mac    = '00:00:00:00:00:00';
    this.name   = 'eth' + this.port_id;
    this.speed  = '1_gbps';
    this.mode   = 'full_duplex';
    this.medium = 'Copper';
  }
}

Port.prototype.clone = function() {
  return new Port(this);
};

var PortUI              = Port;
PortUI.prototype.toBase = Port.prototype.clone;

TIPS.port = {
  port_id: 'Ethernet port identifier',
  mac:     'MAC address used by port in spanning tree',
  name:    'display name of the port',
  speed:   'physical layer speed of port',
  mode:    'physical layer transmission mode',
  medium:  'physical layer medium of port'
};

TESTS.port = {
  mac: ETHERNET.isMac,
  name: function(v) { return /[a-zA-Z_][a-zA-Z_0-9]*/.test(v) }
};

var SPEEDS = [{
  label: '10 Mbps',
  value: '10_mbps'
}, {
  label: '100 Mbps',
  value: '100_mbps'
}, {
  label: '1 Gbps',
  value: '1_gbps'
}, {
  label: '10 Gbps',
  value: '10_gbps'
}, {
  label: '40 Gbps',
  value: '40_gbps'
}, {
  label: '100 Gbps',
  value: '100_gbps'
}, {
  label: '1 Tbps',
  value: '1_tbps'
}];

var MODES = [{
  label: 'Half Duplex',
  value: 'half_duplex'
}, {
  label: 'Full Duplex',
  value: 'full_duplex'
}];

var MEDIUMS = [
  'Copper',
  'Fiber'
];

function Ports(ports) {
if(ports /*&& ports instanceof Ports*/) {
    this.n_ports = ports.n_ports;
    this.ports = _.map(ports.ports, function(port) {
      return new Port(port);
    });
    this.vports = _.clone(ports.vports);
  } else {
    if(ports && typeof ports === 'number'){
      this.n_ports = ports;
    } else {
      this.n_ports = 24;
    }
    this.ports = _.map(_.range(this.n_ports), function(idx) {
      return new Port(idx);
    });
    this.vports = {
      port_stats: true,
      stp:        false,
      in_port:    true,
      table:      true,
      normal:     true,
      flood:      true,
      all:        true,
      controller: true,
      local:      true,
      any:        true,
      none:       true
    };
  }
}

Ports.prototype.clone = function() {
  return new Ports(this);
}

var PortsUI              = Ports;
PortsUI.prototype.toBase = Ports.prototype.clone;

PortsUI.prototype.rebuild = function() {
  var i;
  if(this.n_ports === this.ports.length) {
    return;
  } else if(this.n_ports < this.ports.length) {
    this.ports.splice(this.n_ports, this.ports.length-this.n_ports);
  } else {
    for(i=this.ports.length; i<this.n_ports; ++i) {
      this.ports.push(new Port(i));
    }
  }
};

function Meters(meters) {
  if(meters && meters instanceof Meters) {
  } else {
  }
}
Meters.prototype.clone = function() {
  return new Meters(this);
}

var MetersUI = Meters;
MetersUI.prototype.toBase = Meters.prototype.clone;

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

function Groups(groups) {
  if(groups && groups instanceof Groups) {
  } else {
  }
}

Groups.prototype.clone = function() {
  return new Groups(this);
}

var GroupsUI              = Groups;
GroupsUI.prototype.toBase = Groups.prototype.clone;

function Profile(p) {
  if(typeof p === 'string') {
    this.name = p;
    this.datapath = new Datapath();
    this.ports    = new Ports();
    this.meters   = new Meters();
    this.tables   = new Tables();
    this.groups   = new Groups();
  } else if(p) {
    this.name     = p.name;
    this.datapath = new Datapath(p.datapath);
    this.ports    = new Ports(p.ports);
    this.meters   = new Meters(p.meters);
    this.tables   = new Tables(p.tables);
    this.groups   = new Groups(p.groups);
  } else {
    throw 'Bad construction: Profile';
  }
}
Profile.prototype.clone = function() {
  return new Profile(this);
};

var ProfileUI = Profile;
ProfileUI.prototype.toBase = Profile.prototype.clone;

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


      return p
    }
    function openflow_1_1(p) {
      // openflow preseelect 1.1 code goes here
      console.log('preselecting 1.1');
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
      MEDIUMS: MEDIUMS,
      MODES: MODES,
      SPEEDS: SPEEDS
    };

});
