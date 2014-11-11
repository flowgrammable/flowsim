'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.tables
 * @description
 * # tables
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Tables', function(fgConstraints, ETHERNET, Instruction,
        Match, Table) {

/* Default Construction Constants */
var defaultTables = 8;

function Tables(tbls, profile) {
  if(_.isObject(tbls)) {
    _.extend(this, tbls);
    this.tables = _.map(tbls.tables, function(table){
      return new Table.Table(table);
    });
  } else {
    this.tables = _.map(profile.tables, function(table){
      return new Table.Table(null, table);
    });
  }
}


Tables.Profile = function(prof, tables){
  if(prof instanceof Tables.Profile ||
      (typeof prof ==='object' && prof !== null)){
    _.extend(this, prof);
    this.tables = _.map(prof.tables, function(table) {
      return new Table.Profile(table);
    });
  } else {
    this.n_tables = defaultTables;
    this.tables = _.map(_.range(this.n_tables), function(id) {
      return new Table.Profile(id);
    });
  }
}

Tables.Profile.TIPS = {
  table_id: 'Unique table identifier',
  name: 'Descriptive name for flow table type',
  max_entries: 'Maximum flows supported',
  table_stats: 'Ability of table to record lookup statistics',
  flow_stats: 'Ability of flow to record match statistics',
  flow_caps: 'Match, Instruction, and Actions to support',
  Match: Match.Profile.TIPS,
  Instruction: Instruction.Profile.TIPS,
  Miss: Instruction.Profile.TIPS
};

Tables.Profile.prototype.rebuild = function() {
  var i;
  if(this.n_tables === this.tables.length) {
    return;
  } else if(this.n_tables < this.tables.length) {
    this.tables.splice(this.n_tables, this.tables.length-this.n_tables);
  } else {
    for(i=this.tables.length; i<this.n_tables; ++i) {
      this.tables.push(new Table.Profile(i));
    }
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




var TIPS = {
  n_tables: 'Number of flow tables available',
  Table: Table.Profile.TIPS
};

var TESTS = {
  n_tables: fgConstraints.isUInt(0,0xff),
  Table: Table.Profile.TESTS
};

Tables.prototype.clone = function() {
  return new Tables(this);
};

var TablesUI = Tables;
TablesUI.prototype.toBase = Tables.prototype.clone;

return {
  Capabilities: Tables.Profile,
  Configuration: Tables,
  TIPS: TIPS,
  TESTS: TESTS
};

});
