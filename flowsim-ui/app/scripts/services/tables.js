'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.tables
 * @description
 * # tables
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Tables', function(Regex, fgConstraints, Match, Instruction) {

/* Default Construction Constants */
var defTables = 8;

var defName = 'table';

var defTableStats     = true;
var defFlowStats      = true;
var defMissController = false;
var defMissContinue   = false;
var defMissDrop       = false;
var defMaxEntries     = 1024;

function Priority(priority, priValue) {
  if(_.isObject(priority)) {
    _.extend(this, priority);
    this.flows = _(priority).map(function(flow) {
      return flow.clone();
    });
  } else {
    this.flows = [];
    this.priority = priValue;
  }
}

Priority.prototype.clone = function() {
  return new Priority(this);
};

Priority.prototype.add = function(flow) {
  this.flows.push(flow);
};

Priority.prototype.del = function(idx) {
  this.flows.splice(idx, 1);
};

Priority.prototype.select = function(key) {
  return _(this.flows).find(function(flow) {
    return flow.match.match(key);
  });
};

function Table(table, tableProfile) {
  if(_.isObject(table)) {
    _.extend(this, table);
    this.capabilities = new TableProfile(table.capabilities);
  } else {
    this.capabilities = new TableProfile(tableProfile);
    this.id          = tableProfile.id;
    this.name        = tableProfile.name;
    this.max_entries = tableProfile.max_entries;

    this.priorities = [];
    this.prioritiesPresent = {};
    this.miss = null;
  }
}

Table.prototype.clone = function() {
  return new Table(this);
};

Table.prototype.select = function(key) {
};

Table.prototype.add = function(priority, flow) {
  if(!_(this.prioritiesPresent).has(priority.toString())) {
    this.prioritiesPresent[priority.toString()] = true;
  }

};

Table.prototype.del = function(priority, idx) {
  if(_(this.prioritiesPresent).has(priority.toString())) {
    this.prioritiesPresent[priority.toString()] = true;
  }
};

function TableProfile(tableProfile, id) {
  if(_.isObject(tableProfile)) {
    _.extend(this, tableProfile);
    this.match       = new Match.Profile(tableProfile.match);
    this.instruction = new Instruction.Profile(tableProfile.instruction);
    this.miss        = new Instruction.Profile(tableProfile.miss);
  } else {
    this.id          = id;
    this.name        = defName + id;
    this.max_entries = defMaxEntries;
    this.table_stats = defTableStats;
    this.flow_stats  = defFlowStats;
    this.match       = new Match.Profile();
    this.instruction = new Instruction.Profile();
    this.miss        = new Instruction.Profile();
  }
}

TableProfile.prototype.clone = function() {
  return new TableProfile(this);
};

function Tables(tables, profile) {
  if(_.isObject(tables)) {
    _.extend(this, tables);
    this.tables = _(tables.tables).map(function(table){
      return new Table(table);
    });
  } else {
    this.tables = _(profile.n_tables).times(function(id) {
      return new Table(null, id, profile);
    });
    this.tables = _.map(profile.tables, function(table){
      return new Table(null, table);
    });
  }
}

Tables.prototype.clone = function() {
  return new Tables(this);
};

Tables.prototype.get = function(id) {
  if(id < this.tables.length) {
    return this.tables[id];
  }
};

function Profile(profile){
  if(_.isObject(profile)) {
    _.extend(this, profile);
    this.tables = _.map(profile.tables, function(table) {
      return new TableProfile(table);
    });
  } else {
    this.n_tables = defTables;
    this.tables = _(this.n_tables).times(function(id) {
      return new TableProfile(null, id);
    });
  }
}

Profile.prototype.clone = function() {
  return new Profile(this);
};

Profile.prototype.rebuild = function() {
  if(this.n_tables === this.tables.length) {
    return;
  } else if(this.n_tables < this.tables.length) {
    this.tables.splice(this.n_tables, this.tables.length-this.n_tables);
  } else {
    _(this.n_tables-this.tables.length).times(function(id) {
      this.tables.push(new TableProfile(null, id));
    });
  }
};


/*
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
-      }
}

Capabilities.prototype.openflow_1_1 = function() {
  var i,j,k;
  for (i = 0; i < this.n_tables; i++) {
    var match = this.tables[i].match;
    var inst = this.tables[i].instruction;
    var miss = this.tables[i].miss;
    for (j = 0; j < match.fields.length; j++) {
      var item = match.fields[j];
      switch (item.key) {
      case 'in_port':
      case 'eth_typelen':
      case 'vlan_pcp':
      case 'vlan_vid':
      case 'mpls_label':
      case 'mpls_tc':
      case 'ipv4_dscp':
      case 'ipv4_proto':
      case 'icmpv4_type':
      case 'icmpv4_code':
      case 'tcp_src':
      case 'tcp_dst':
      case 'udp_src':
      case 'udp_dst':
      case 'sctp_src':
      case 'sctp_dst':
        item.enabled = true;
        item.wildcardable = true;
        item.maskable = false;
        break;
      case 'eth_src':
      case 'eth_dst':
      case 'ipv4_src':
      case 'ipv4_dst':
        item.enabled = true;
        item.wildcardable = true;
        item.maskable = true;
        break;
      default:
        item.enabled = false;
      }
    }

    inst.caps = {
      apply    : true,
      clear    : true,
      write    : true,
      metadata : true,
      meter    : false,
      goto_    : true
    };

    for (j = 0; j < inst.apply.length; j++) {
      for (k = 0; k < inst.apply[j].fields.length; k++) {
        var act = inst.apply[j].fields[k];
        switch (act.key) {
        case 'drop':
        case 'forward':
        case 'copy_ttl_out':
        case 'copy_ttl_in':
        case 'set_mpls_ttl':
        case 'dec_mpls_ttl':
        case 'pop_vlan':
        case 'push_vlan':
        case 'push_mpls':
        case 'pop_mpls':
        case 'set_queue':
        case 'set_group':
        case 'set_nw_ttl':
        case 'dec_nw_ttl':
        case 'set_eth_src':
        case 'set_eth_dst':
        case 'set_vlan_vid':
        case 'set_vlan_pcp':
        case 'set_ip_ecn':
        case 'set_ipv4_src':
        case 'set_ipv4_dst':
        case 'set_nw_tos':
        case 'set_udp_src':
        case 'set_udp_dst':
        case 'set_tcp_src':
        case 'set_tcp_dst':
        case 'set_sctp_src':
        case 'set_sctp_dst':
        case 'set_mpls_label':
        case 'set_mpls_tc':
          act.value = true;
          break;
        default:
          act.value = false;
        }
      }

      for (k = 0; k < inst.write[j].fields.length; k++) {
        var act = inst.write[j].fields[k];
        switch (act.key) {
        case 'drop':
        case 'forward':
        case 'copy_ttl_out':
        case 'copy_ttl_in':
        case 'set_mpls_ttl':
        case 'dec_mpls_ttl':
        case 'pop_vlan':
        case 'push_vlan':
        case 'push_mpls':
        case 'pop_mpls':
        case 'set_queue':
        case 'set_group':
        case 'set_nw_ttl':
        case 'dec_nw_ttl':
        case 'set_eth_src':
        case 'set_eth_dst':
        case 'set_vlan_vid':
        case 'set_vlan_pcp':
        case 'set_ip_ecn':
        case 'set_ipv4_src':
        case 'set_ipv4_dst':
        case 'set_nw_tos':
        case 'set_udp_src':
        case 'set_udp_dst':
        case 'set_tcp_src':
        case 'set_tcp_dst':
        case 'set_sctp_src':
        case 'set_sctp_dst':
        case 'set_mpls_label':
        case 'set_mpls_tc':
          act.value = true;
          break;
        default:
          act.value = false;
        }
      }
    }

    miss.caps = {
      apply    : true,
      clear    : true,
      write    : true,
      metadata : true,
      meter    : false,
      goto_    : true
    };

    for (j = 0; j < miss.apply.length; j++) {
      for (k = 0; k < miss.apply[j].fields.length; k++) {
        var act = miss.apply[j].fields[k];
        switch (act.key) {
        case 'drop':
        case 'forward':
        case 'copy_ttl_out':
        case 'copy_ttl_in':
        case 'set_mpls_ttl':
        case 'dec_mpls_ttl':
        case 'pop_vlan':
        case 'push_vlan':
        case 'push_mpls':
        case 'pop_mpls':
        case 'set_queue':
        case 'set_group':
        case 'set_nw_ttl':
        case 'dec_nw_ttl':
        case 'set_eth_src':
        case 'set_eth_dst':
        case 'set_vlan_vid':
        case 'set_vlan_pcp':
        case 'set_ip_ecn':
        case 'set_ipv4_src':
        case 'set_ipv4_dst':
        case 'set_nw_tos':
        case 'set_udp_src':
        case 'set_udp_dst':
        case 'set_tcp_src':
        case 'set_tcp_dst':
        case 'set_sctp_src':
        case 'set_sctp_dst':
        case 'set_mpls_label':
        case 'set_mpls_tc':
          act.value = true;
          break;
        default:
          act.value = false;
        }
      }

      for (k = 0; k < miss.write[j].fields.length; k++) {
        var act = miss.write[j].fields[k];
        switch (act.key) {
        case 'drop':
        case 'forward':
        case 'copy_ttl_out':
        case 'copy_ttl_in':
        case 'set_mpls_ttl':
        case 'dec_mpls_ttl':
        case 'pop_vlan':
        case 'push_vlan':
        case 'push_mpls':
        case 'pop_mpls':
        case 'set_queue':
        case 'set_group':
        case 'set_nw_ttl':
        case 'dec_nw_ttl':
        case 'set_eth_src':
        case 'set_eth_dst':
        case 'set_vlan_vid':
        case 'set_vlan_pcp':
        case 'set_ip_ecn':
        case 'set_ipv4_src':
        case 'set_ipv4_dst':
        case 'set_nw_tos':
        case 'set_udp_src':
        case 'set_udp_dst':
        case 'set_tcp_src':
        case 'set_tcp_dst':
        case 'set_sctp_src':
        case 'set_sctp_dst':
        case 'set_mpls_label':
        case 'set_mpls_tc':
          act.value = true;
          break;
        default:
          act.value = false;
        }
      }
    }

  }
}

Capabilities.prototype.openflow_1_2 = function() {
}

Capabilities.prototype.openflow_1_3 = function() {
}

Capabilities.prototype.openflow_1_4 = function() {
}
*/

Profile.prototype.ofp_1_0 = function() {};
Profile.prototype.ofp_1_1 = function() {};
Profile.prototype.ofp_1_2 = function() {};
Profile.prototype.ofp_1_3 = function() {};
Profile.prototype.ofp_1_4 = function() {};

var TIPS = {
  n_tables: 'Number of flow tables available',
  Table: {
    table_id:     'Unique table identifier',
    name:         'Descriptive name for flow table type',
    max_entries:  'Maximum flows supported',
    table_stats:  'Ability of table to record lookup statistics',
    flow_stats:   'Ability of flow to record match statistics',
    flow_caps:    'Match, Instruction, and Actions to support',
    Match:        Match.Profile.TIPS,
    Instruction:  Instruction.Profile.TIPS,
    Miss:         Instruction.Profile.TIPS
  }
};

var TESTS = {
  n_tables: fgConstraints.isUInt(0,0xff),
  Table: {
    name: function(n) { return Regex.Identifier.test(n); },
    max_entries: fgConstraints.isUInt(0,0xffffffff),
    Match: Match.Profile.TESTS,
    Instruction: Instruction.Profile.TESTS,
    Miss: Instruction.Profile.TESTS
  }
};

var RANGES = {
};

return {
  Profile: Profile,
  Tables: Tables,
  TIPS: TIPS,
  TESTS: TESTS,
  RANGES: RANGES
};

});
