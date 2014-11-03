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

Match.Capabilities = function(match) {
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
  ipv4_dst: 'Match on IPv4 destination'
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
  ipv4_dst: fgConstraints.isUInt(0, 0xffffffff)
};

var Instruction = {};

Instruction.Capabilities = function(ins) {
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
  if(table) {
    if(table instanceof Table.Capabilities) {
      // copy constructor
      this.table_id    = table.table_id;
      this.name        = table.name;
      this.max_entries = table.max_entries;
      this.table_stats = table.table_stats;
      this.flow_stats  = table.flow_stats;
      this.match       = new Match.Capabilities(table.match);
      this.instruction = new Instruction.Capabilities(table.instruction);
      this.miss        = new Miss.Capabilities(table.miss);
    } else if(typeof table === 'number') {
      this.table_id    = table;
      this.name        = 'table' + this.table_id;
      this.max_entries = defaultMaxEntries;
      this.table_stats = defaultTableStats;
      this.flow_stats  = defaultFlowStats;
      this.match       = new Match.Capabilities();
      this.instruction = new Instruction.Capabilities();
      this.miss        = new Miss.Capabilities();
    } else {
      // JSON constructor
      _.extend(this, tables);
      this.match       = new Match.Capabilities(table.match);
      this.instruction = new Instruction.Capabilities(table.instruction);
      this.miss        = new Miss.Capabilities(table.miss);
    }
  }
};

Table.TIPS = {
  table_id: 'Unique table identifier',
  name: 'Descriptive name for flow table type',
  max_entries: 'Maximum flows supported',
  table_stats: 'Ability of table to record lookup statistics',
  flow_stats: 'Ability of flow to record match statistics',
  flow_caps: 'Match, Instruction, and Actions to support'
};

Table.TESTS = {
  name: function(n) { return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(n); },
  max_entries: fgConstraints.isUInt(0,0xffffffff)
};

Table.Configuration = function(tables) {
  if(tables) {
    if(tables instanceof Capabilities) {
      // capability constructor
    } else if(tables instanceof Configuration) {
      // JSON constructor
    }
  }
};

function Capabilities(tables) {
  if(tables) {
    if(tables instanceof Capabilities) {
      this.n_tables = tables.n_tables;
      this.tables = _.map(tables.tables, function(t) { 
        return new Table.Capabilities(t); 
      });
    } else if(typeof tables === 'number') {
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

function Configuration(tables) {
  if(tables) {
    if(tables instanceof Capabilities) {
      // capability constructor
    } else if(tables instanceof Configuration) {
      // copy constructor
    } else {
      // JSON constructor
      _.extend(this, tables);
    }
  } else {
    // default constructor
  }
}

var TIPS = {
  n_tables: 'Number of flow tables available',
  match: Match.TIPS,
  instruction: Instruction.TIPS,
  miss: Miss.TIPS,
  table: Table.TIPS
};

var TESTS = {
  n_tables: fgConstraints.isUInt(0,0xff),
  match: Match.TESTS,
  instruction: Instruction.TESTS,
  miss: Miss.TESTS,
  table: Table.TESTS
};

return {
  Capabilities: Capabilities,
  Configuration: Configuration,
  TIPS: TIPS,
  TESTS: TESTS
};

});
