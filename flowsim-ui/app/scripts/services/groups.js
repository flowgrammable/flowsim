'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.groups
 * @description
 * # groups
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Groups', function(fgConstraints) {

var defaultGroups = 10;

var Groups = {};

Groups.TIPS = {
  // All
  max_groups: 'Maximum number of groups for each type',
  // Group types
  all: 'Execute all buckets in a group',
  select: 'Execute one bucket in the group',
  indirect: 'Execute the one defined bucket in a group. '+
            'This group type supports only a single bucket.',
  fastfailover: 'This group type executes the first live bucket',
  // Group Capabilities
  select_weight: 'Support weight for select type groups',
  select_liveness: 'Support liveness for select type groups',
  chaining: 'Support chaining groups',
  chaining_checks: 'Check chaining for loops and delete',
  stats: 'Supports stats for groups',
  supportedActions: 'Actions supported by groups'
};

Groups.TESTS = {
  max_groups: fgConstraints.isUInt(0, 0xffffffff),
};

function mkActionField(name, value, key) {
  return {
    name: name,
    value: value,
    key: key
  };
}


function Capabilities(groups) {
  if(groups) {
    _.extend(this, groups);
    this.actions = _.map(groups.actions, function(f) { return _.clone(f); });
  } else {
    // default constructor
    this.max_groups = defaultGroups;
    this.all = true;
    this.select = true;
    this.indirect = true;
    this.fastfailover = true;
    this.select_weight = true;
    this.select_liveness = true;
    this.chaining = true;
    this.chaining_checks = true;
    this.stats = true;
    this.actions = [{
      protocol: 'Internal',
      fields: [
        mkActionField('Output', true, 'forward'),
        mkActionField('Drop', true, 'drop'),
        mkActionField('Set Group', true, 'set_group'),
        mkActionField('Set Queue', true, 'set_queue')
      ]
    }, {
      protocol: 'Ethernet',
        fields: [
          mkActionField('Src write', true, 'set_eth_src'),
          mkActionField('Dst write', true, 'set_eth_dst'),
          mkActionField('Typelen write', true, 'set_eth_type')
        ]
    }, {
    protocol: 'ARP',
      fields: [
        mkActionField('Opcode write', true, 'set_arp_op'),
        mkActionField('SHA write', true, 'set_arp_sha'),
        mkActionField('SPA write', true, 'set_arp_spa'),
        mkActionField('THA write', true, 'set_arp_tha'),
        mkActionField('TPA write', true, 'set_arp_tpa')
      ]
    }, {
      protocol: 'MPLS',
      fields: [
        mkActionField('Label write', true, 'set_mpls_label'),
        mkActionField('TC write', true, 'set_mpls_tc'),
        mkActionField('BOS write', true, 'set_mpls_bos'),
        mkActionField('Set TTL', true, 'set_mpls_ttl'),
        mkActionField('Dec TTL', true, 'dec_mpls_ttl'),
        mkActionField('Push Tag', true, 'push_mpls'),
        mkActionField('Pop Tag', true, 'pop_mpls')
      ]
    }, {
      protocol: 'VLAN',
      fields: [
        mkActionField('PCP write', true, 'set_vlan_pcp'),
        mkActionField('DEI write', true, 'set_vlan_dei'),
        mkActionField('VID write', true, 'set_vlan_vid'),
        mkActionField('Push tag', true, 'push_vlan'),
        mkActionField('Pop tag', true, 'pop_vlan')
      ]
    }, {
      protocol: 'IPv4',
      fields: [
        mkActionField('DSCP write', true, 'set_ip_dscp'),
        mkActionField('ECN write', true, 'set_ip_ecn'),
        mkActionField('Proto write', true, 'set_ip_proto'),
        mkActionField('Src write', true, 'set_ipv4_src'),
        mkActionField('Dst write', true, 'set_ipv4_dst'),
        mkActionField('Set TTL', true, 'set_nw_ttl'),
        mkActionField('Dec TTL', true, 'dec_nw_ttl')
      ]
    }, {
      protocol: 'IPv6',
      fields: [
        mkActionField('Src write', true, 'set_ipv6_src'),
        mkActionField('Dst write', true, 'set_ipv6_dst'),
        mkActionField('FLabel write', true, 'set_ipv6_flabel')
      ]
    }, {
      protocol: 'ICMPv4',
      fields: [
        mkActionField('Type write', true, 'set_icmpv4_type'),
        mkActionField('Code write', true, 'set_icmpv4_code')
      ]
    }, {
      protocol: 'ICMPv6',
      fields: [
        mkActionField('Type write', true, 'set_icmpv6_type'),
        mkActionField('Code write', true, 'set_icmpv6_code')
      ]
    }, {
      protocol: 'TCP',
      fields: [
        mkActionField('Src write', true, 'set_tcp_src'),
        mkActionField('Dst write', true, 'set_tcp_dst')
      ]
    }, {
      protocol: 'UDP',
      fields: [
        mkActionField('Src write', true, 'set_udp_src'),
        mkActionField('Dst write', true, 'set_udp_dst')
      ]
    }, {
      protocol: 'SCTP',
      fields: [
        mkActionField('Src write', true, 'set_sctp_src'),
        mkActionField('Dst write', true, 'set_sctp_dst')
      ]
    }];

  }
}

Capabilities.prototype.openflow_1_0 = function() {
};

Capabilities.prototype.openflow_1_1 = function() {
};

Capabilities.prototype.openflow_1_2 = function() {
};

Capabilities.prototype.openflow_1_3 = function() {
};

Capabilities.prototype.openflow_1_4 = function() {
};

function Configuration(groups) {
  if(groups) {
    if(groups instanceof Capabilities) {
      // capabiliy constructor
      this.max_groups = groups.max_groups;
    } else if(groups instanceof Configuration) {
      // copy consturctor
    } else {
      // JSON constructor
      _.extend(this, groups);
    }
  } else {
    // default constructor
  }
}


return {
  Capabilities: Capabilities,
  Configuration: Configuration,
  TIPS: Groups.TIPS,
  TESTS: Groups.TESTS
};

});
