'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.tables
 * @description
 * # tables
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Tables', function(fgConstraints, ETHERNET) {

/* Default Construction Constants */
var defaultTables     = 8;
var defaultMaxEntries = 1024;
var defaultTableStats = true;
var defaultFlowStats  = true;

var Match = {};

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

Match.Capabilities = function(match) {
  if(match) {
    _.extend(this, match);
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
      createMatch('IPv4', 'Dst', 'ipv4_dst', true, true, '0xffffffff'),
      createMatch('IPv6', 'Src', 'ipv6_src', true, true,
        '0xffffffffffffffffffffffffffffffff'),
      createMatch('IPv6', 'Dst', 'ipv6_dst', true, true,
        '0xffffffffffffffffffffffffffffffff'),
      createMatch('IPv6', 'Flow Label', 'ipv6_flabel', true, true,
        '0xfffff'),
      createMatch('ICMPv6', 'Type', 'icmpv6_type', true, true, '0xff'),
      createMatch('ICMPv6', 'Code', 'icmpv6_code', true, true, '0xff'),
      createMatch('ICMPv4', 'Type', 'icmpv6_type', true, true, '0xff'),
      createMatch('ICMPv4', 'Code', 'icmpv6_code', true, true, '0xff'),
      createMatch('TCP', 'Src', 'tcp_src', true, true, '0xffff'),
      createMatch('TCP', 'Dst', 'tcp_dst', true, true, '0xffff'),
      createMatch('UDP', 'Src', 'udp_src', true, true, '0xffff'),
      createMatch('UDP', 'Dst', 'udp_dst', true, true, '0xffff'),
      createMatch('SCTP', 'Src', 'sctp_src', true, true, '0xffff'),
      createMatch('SCTP', 'Dst', 'sctp_dst', true, true, '0xffff')
    ];
  }
};

Match.Configuration = function(match) {
};

Match.TIPS = {
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
  ipv4_dst: 'Match on IPv4 destination',
  ipv6_dst: 'Match on IPv6 destination',
  ipv6_src: 'Match on IPv6 source',
  tcp_src: 'Match on TCP source',
  tcp_dst: 'Match on TCP destination',
  udp_src: 'Match on UDP source',
  udp_dst: 'Match on UDP destination',
  sctp_src: 'Match on SCTP source',
  sctp_dst: 'Match on SCTP destination'
};

Match.TESTS = {
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
  ipv4_dst: fgConstraints.isUInt(0, 0xffffffff),
  icmpv4_type: fgConstraints.isUInt(0, 0xff),
  icmpv4_code: fgConstraints.isUInt(0, 0xff),
  icmpv6_type: fgConstraints.isUInt(0, 0xff),
  icmpv6_code: fgConstraints.isUInt(0, 0xff),
  ipv6_src: fgConstraints.isUInt(0,
    0xffffffffffffffffffffffffffffffff),
  ipv6_dst: fgConstraints.isUInt(0,
    0xffffffffffffffffffffffffffffffff),
  tcp_src: fgConstraints.isUInt(0, 0xffff),
  tcp_dst: fgConstraints.isUInt(0, 0xffff),
  udp_src: fgConstraints.isUInt(0, 0xffff),
  udp_dst: fgConstraints.isUInt(0, 0xffff),
  sctp_src: fgConstraints.isUInt(0, 0xffff),
  sctp_dst: fgConstraints.isUInt(0, 0xffff)
};

function mkActionField(name, value) {
  return {
    name: name,
    value: value
  };
}

var Instruction = {};

Instruction.Capabilities = function(ins) {
  if(ins) {
    _.extend(this, ins);
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
        mkActionField('Drop', true),
        mkActionField('Set Group', true),
        mkActionField('Set Queue', true)
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
        mkActionField('SPA write', true),
        mkActionField('THA write', true),
        mkActionField('TPA write', true)
      ]
    }, {
      protocol: 'MPLS',
      fields: [
        mkActionField('Label write', true),
        mkActionField('TC write', true),
        mkActionField('BOS write', true),
        mkActionField('Set TTL', true),
        mkActionField('Dec TTL', true),
        mkActionField('Push Tag', true),
        mkActionField('Pop Tag', true)
      ]
    }, {
      protocol: 'VLAN',
      fields: [
        mkActionField('PCP write', true),
        mkActionField('DEI write', true),
        mkActionField('VID write', true),
        mkActionField('Push tag', true),
        mkActionField('Pop tag', true)
      ]
    }, {
      protocol: 'IPv4',
      fields: [
        mkActionField('DSCP write', true),
        mkActionField('ECN write', true),
        mkActionField('Proto write', true),
        mkActionField('Src write', true),
        mkActionField('Dst write', true),
        mkActionField('Set TTL', true),
        mkActionField('Dec TTL', true)
      ]
    }, {
      protocol: 'IPv6',
      fields: [
        mkActionField('Src write', true),
        mkActionField('Dst write', true),
        mkActionField('FLabel write', true)
      ]
    }, {
      protocol: 'ICMPv4',
      fields: [
        mkActionField('Type write', true),
        mkActionField('Code write', true)
      ]
    }, {
      protocol: 'ICMPv6',
      fields: [
        mkActionField('Type write', true),
        mkActionField('Code write', true)
      ]
    }, {
      protocol: 'TCP',
      fields: [
        mkActionField('Src write', true),
        mkActionField('Dst write', true)
      ]
    }, {
      protocol: 'UDP',
      fields: [
        mkActionField('Src write', true),
        mkActionField('Dst write', true)
      ]
    }, {
      protocol: 'SCTP',
      fields: [
        mkActionField('Src write', true),
        mkActionField('Dst write', true)
      ]
    }];
    this.write = [{
      protocol: 'Internal',
      fields: [
        mkActionField('Output', true),
        mkActionField('Drop', true),
        mkActionField('Set Group', true),
        mkActionField('Set Queue', true)
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
        mkActionField('SPA write', true),
        mkActionField('THA write', true),
        mkActionField('TPA write', true)
      ]
    }, {
      protocol: 'MPLS',
      fields: [
        mkActionField('Label write', true),
        mkActionField('TC write', true),
        mkActionField('BOS write', true),
        mkActionField('Set TTL', true),
        mkActionField('Dec TTL', true),
        mkActionField('Push Tag', true),
        mkActionField('Pop Tag', true)
      ]
    }, {
      protocol: 'VLAN',
      fields: [
        mkActionField('PCP write', true),
        mkActionField('DEI write', true),
        mkActionField('VID write', true),
        mkActionField('Push tag', true),
        mkActionField('Pop tag', true)
      ]
    }, {
      protocol: 'IPv4',
      fields: [
        mkActionField('DSCP write', true),
        mkActionField('ECN write', true),
        mkActionField('Proto write', true),
        mkActionField('Src write', true),
        mkActionField('Dst write', true),
        mkActionField('Set TTL', true),
        mkActionField('Dec TTL', true)
      ]
    }, {
      protocol: 'IPv6',
      fields: [
        mkActionField('Src write', true),
        mkActionField('Dst write', true),
        mkActionField('FLabel write', true)
      ]
    }, {
      protocol: 'ICMPv4',
      fields: [
        mkActionField('Type write', true),
        mkActionField('Code write', true)
      ]
    }, {
      protocol: 'ICMPv6',
      fields: [
        mkActionField('Type write', true),
        mkActionField('Code write', true)
      ]
    }, {
      protocol: 'TCP',
      fields: [
        mkActionField('Src write', true),
        mkActionField('Dst write', true)
      ]
    }, {
      protocol: 'UDP',
      fields: [
        mkActionField('Src write', true),
        mkActionField('Dst write', true)
      ]
    }, {
      protocol: 'SCTP',
      fields: [
        mkActionField('Src write', true),
        mkActionField('Dst write', true)
      ]
    }];
    this.metadata = '0xffffffffffffffff';
    this.goto_ = [];
  }
};

Instruction.Configuration = function(ins) {
};

Instruction.TIPS = {
  apply: 'Applies actions immediately',
  clear: 'Clears the action set',
  write: 'Appends actions to the action set',
  metadata: 'Writes metadata register',
  meter: 'Sends packet to designated meter',
  goto_: 'Jumps to another flow table'
};

Instruction.TESTS = {
  metadata: fgConstraints.isUInt(0, 0xffffffffffffffff),
  goto_: function(input) {
    return /^([0-9]+)(\.\.([0-9]+))?$/.test(input);
  }
};

var Miss = Instruction;

var Table = {};

Table.Capabilities = function(table) {
  if(typeof table === 'number') {
    this.table_id    = table;
    this.name        = 'table' + this.table_id;
    this.max_entries = defaultMaxEntries;
    this.table_stats = defaultTableStats;
    this.flow_stats  = defaultFlowStats;
    this.match       = new Match.Capabilities();
    this.instruction = new Instruction.Capabilities();
    this.miss        = new Miss.Capabilities();
  } else {
    _.extend(this, table);
    this.match       = new Match.Capabilities(table.match);
    this.instruction = new Instruction.Capabilities(table.instruction);
    this.miss        = new Miss.Capabilities(table.miss);
  }
};

Table.TIPS = {
  table_id: 'Unique table identifier',
  name: 'Descriptive name for flow table type',
  max_entries: 'Maximum flows supported',
  table_stats: 'Ability of table to record lookup statistics',
  flow_stats: 'Ability of flow to record match statistics',
  flow_caps: 'Match, Instruction, and Actions to support',
  Match: Match.TIPS,
  Instruction: Instruction.TIPS,
  Miss: Instruction.TIPS
};

Table.TESTS = {
  name: function(n) { return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(n); },
  max_entries: fgConstraints.isUInt(0,0xffffffff),
  Match: Match.TESTS,
  Instruction: Instruction.TESTS,
  Miss: Instruction.TESTS
};

Table.Stats = function() {
};

Table.Configuration = function(table) {
  if(table instanceof Table.Capabilities) {
    this.table_id    = table.table_id;
    this.name        = table.name;
    this.max_entries = table.max_entries;
    if(table.table_stats) {
      this.stats = new Table.Stats();
    }
  } else {
    _.extend(this, table);
    if(table.stats) {
      this.stats = new Table.Stats(table.stats;
    }
  }
};

function Capabilities(tables) {

  if(tables) {
    if(typeof tables === 'number') {
      this.n_tables = tables;
      this.tables = _.map(_.range(this.n_tables), function(id) {
        return new Table.Capabilities(id);
      });
    } else {
      _.extend(this, tables);
      this.tables = _.map(tables.tables, function(t) {
        return new Table.Capabilities(t);
      });
    }
  } else {
    this.n_tables = defaultTables;
    this.tables = _.map(_.range(this.n_tables), function(id) {
      return new Table.Capabilities(id);
    });
  }
}

Capabilities.prototype.rebuild = function() {
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
}

Capabilities.prototype.openflow_1_0 = function() {
/*var i;
-      for (i = 0; i < p.tables.n_tables; i++) {
-        // set relevant match fields:
-        var table = p.tables.tables[i];
-        var j;
-        for (j = 0; j < table.match.fields.length; j++) {
-          var f = table.match.fields[j];
-          if (f.key === 'in_port') {
-            f.enabled = true;
-            f.wildcardable = true;
-            f.maskable = false;
-            f.mask = 0;
-          }
-          // ...
-        }
-      }*/
}

Capabilities.prototype.openflow_1_1 = function() {
}

Capabilities.prototype.openflow_1_2 = function() {
}

Capabilities.prototype.openflow_1_3 = function() {
}

Capabilities.prototype.openflow_1_4 = function() {
}

function Configuration(tables) {
  _.extend(this, tables);
  this.tables = _.map(this.tables, function(table) { 
    return new Table.Configuration(table); 
  });
}

var TIPS = {
  n_tables: 'Number of flow tables available',
  Table: Table.TIPS
};

var TESTS = {
  n_tables: fgConstraints.isUInt(0,0xff),
  Table: Table.TESTS
};

return {
  Capabilities: Capabilities,
  Configuration: Configuration,
  TIPS: TIPS,
  TESTS: TESTS
};

});
